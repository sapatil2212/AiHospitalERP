/**
 * Subscription & Trial Auto-Deactivation Test Script
 * Verifies:
 * 1. Hospital onboarding database transaction.
 * 2. Hospital details updating.
 * 3. Auto-expiration status transitions (trial and active subscriptions).
 * 4. Middleware logic assertions (trial expired, subscription expired, disabled, suspended, cancelled).
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper to simulate authMiddleware deactivation check
function checkHospitalAccess(hospital) {
  const now = new Date();
  const status = hospital.subscriptionStatus;
  const trialEnd = hospital.trialEndDate ? new Date(hospital.trialEndDate) : null;
  const subEnd = hospital.subscriptionEndDate ? new Date(hospital.subscriptionEndDate) : null;

  if (!hospital.isVerified) {
    return { success: false, error: "HOSPITAL_DISABLED" };
  }
  if (status === "TRIAL" && trialEnd && now > trialEnd) {
    return { success: false, error: "TRIAL_EXPIRED" };
  }
  if (status === "EXPIRED" || (status === "ACTIVE" && subEnd && now > subEnd)) {
    return { success: false, error: "SUBSCRIPTION_EXPIRED" };
  }
  if (status === "SUSPENDED") {
    return { success: false, error: "ACCOUNT_SUSPENDED" };
  }
  if (status === "CANCELLED") {
    return { success: false, error: "ACCOUNT_CANCELLED" };
  }
  return { success: true };
}

async function runTests() {
  console.log("=== STARTING SUBSCRIPTION & AUTO-DEACTIVATION TESTS ===\n");
  const testEmail = "test_onboard_admin@aihospitalerp-test.com";

  // Clean up any left over test data
  await prisma.user.deleteMany({ where: { email: testEmail } });
  await prisma.hospital.deleteMany({ where: { email: testEmail } });

  let testHospitalId = null;

  try {
    // 1. Onboarding Transaction Test
    console.log("1. Testing Hospital Onboarding Transaction...");
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const onboardingResult = await prisma.$transaction(async (tx) => {
      const hospital = await tx.hospital.create({
        data: {
          name: "Test Automation Hospital",
          mobile: "+919999988888",
          email: testEmail,
          isVerified: true,
          trialStartDate: now,
          trialEndDate: trialEnd,
          subscriptionStatus: "TRIAL",
        },
      });

      const userCode = "USR-0001";
      const userRecord = await tx.user.create({
        data: {
          name: "Test Admin User",
          email: testEmail,
          password: "hashed_password_here",
          role: "HOSPITAL_ADMIN",
          hospitalId: hospital.id,
          userCode,
          isActive: true,
        },
      });

      return { hospital, user: userRecord };
    });

    testHospitalId = onboardingResult.hospital.id;
    console.log("✓ Onboarding Transaction Completed. Hospital ID:", testHospitalId);
    console.log("✓ Admin User created with email:", onboardingResult.user.email);
    console.log("--------------------------------------------------");

    // 2. Hospital Update (PATCH) Test
    console.log("2. Testing Hospital details update (PATCH)...");
    const updatedHospital = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: {
        name: "Test Automation Hospital Updated",
        mobile: "+918888877777",
      },
    });

    if (updatedHospital.name !== "Test Automation Hospital Updated" || updatedHospital.mobile !== "+918888877777") {
      throw new Error("Hospital update properties mismatch!");
    }
    console.log("✓ Hospital updated successfully.");
    console.log("--------------------------------------------------");

    // 3. Auto-expiration logic test (TRIAL expired)
    console.log("3. Testing Trial Auto-Expiration...");
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday

    await prisma.hospital.update({
      where: { id: testHospitalId },
      data: {
        trialEndDate: pastDate,
        subscriptionStatus: "TRIAL",
      },
    });

    // Run the stats query auto-expiration sync
    await prisma.hospital.updateMany({
      where: {
        subscriptionStatus: "TRIAL",
        trialEndDate: { lt: new Date() },
      },
      data: {
        subscriptionStatus: "EXPIRED",
      },
    });

    const statusAfterTrialSync = await prisma.hospital.findUnique({
      where: { id: testHospitalId },
      select: { subscriptionStatus: true },
    });

    if (statusAfterTrialSync.subscriptionStatus !== "EXPIRED") {
      throw new Error("Expected hospital trial status to auto-transition to EXPIRED, got: " + statusAfterTrialSync.subscriptionStatus);
    }
    console.log("✓ Trial status correctly auto-expired to EXPIRED status.");
    console.log("--------------------------------------------------");

    // 4. Auto-expiration logic test (ACTIVE subscription expired)
    console.log("4. Testing Active Subscription Auto-Expiration...");
    await prisma.hospital.update({
      where: { id: testHospitalId },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: pastDate,
      },
    });

    // Run the stats query auto-expiration sync for active subscription
    await prisma.hospital.updateMany({
      where: {
        subscriptionStatus: "ACTIVE",
        subscriptionEndDate: { lt: new Date() },
      },
      data: {
        subscriptionStatus: "EXPIRED",
      },
    });

    const statusAfterSubSync = await prisma.hospital.findUnique({
      where: { id: testHospitalId },
      select: { subscriptionStatus: true },
    });

    if (statusAfterSubSync.subscriptionStatus !== "EXPIRED") {
      throw new Error("Expected hospital active subscription to auto-transition to EXPIRED, got: " + statusAfterSubSync.subscriptionStatus);
    }
    console.log("✓ Active subscription correctly auto-expired to EXPIRED status.");
    console.log("--------------------------------------------------");

    // 5. Middleware logic validation check
    console.log("5. Testing Middleware Security Checks...");

    // Test CASE A: Active & Verified
    const hospActive = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "ACTIVE", subscriptionEndDate: new Date(Date.now() + 86400000), isVerified: true },
    });
    let accessCheck = checkHospitalAccess(hospActive);
    if (!accessCheck.success) throw new Error("Active hospital access check failed!");
    console.log("✓ Case A (Active & Verified) PASSED");

    // Test CASE B: TRIAL expired
    const hospTrialExp = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "TRIAL", trialEndDate: pastDate },
    });
    accessCheck = checkHospitalAccess(hospTrialExp);
    if (accessCheck.success || accessCheck.error !== "TRIAL_EXPIRED") {
      throw new Error("Expected TRIAL_EXPIRED error, got: " + JSON.stringify(accessCheck));
    }
    console.log("✓ Case B (Trial Expired) PASSED");

    // Test CASE C: Subscription Expired
    const hospSubExp = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "EXPIRED" },
    });
    accessCheck = checkHospitalAccess(hospSubExp);
    if (accessCheck.success || accessCheck.error !== "SUBSCRIPTION_EXPIRED") {
      throw new Error("Expected SUBSCRIPTION_EXPIRED error, got: " + JSON.stringify(accessCheck));
    }
    console.log("✓ Case C (Subscription Expired) PASSED");

    // Test CASE D: Suspended Account
    const hospSuspended = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "SUSPENDED" },
    });
    accessCheck = checkHospitalAccess(hospSuspended);
    if (accessCheck.success || accessCheck.error !== "ACCOUNT_SUSPENDED") {
      throw new Error("Expected ACCOUNT_SUSPENDED error, got: " + JSON.stringify(accessCheck));
    }
    console.log("✓ Case D (Suspended Account) PASSED");

    // Test CASE E: Cancelled Account
    const hospCancelled = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "CANCELLED" },
    });
    accessCheck = checkHospitalAccess(hospCancelled);
    if (accessCheck.success || accessCheck.error !== "ACCOUNT_CANCELLED") {
      throw new Error("Expected ACCOUNT_CANCELLED error, got: " + JSON.stringify(accessCheck));
    }
    console.log("✓ Case E (Cancelled Account) PASSED");

    // Test CASE F: Disabled Hospital (isVerified = false)
    const hospDisabled = await prisma.hospital.update({
      where: { id: testHospitalId },
      data: { subscriptionStatus: "ACTIVE", subscriptionEndDate: new Date(Date.now() + 86400000), isVerified: false },
    });
    accessCheck = checkHospitalAccess(hospDisabled);
    if (accessCheck.success || accessCheck.error !== "HOSPITAL_DISABLED") {
      throw new Error("Expected HOSPITAL_DISABLED error, got: " + JSON.stringify(accessCheck));
    }
    console.log("✓ Case F (Disabled Hospital) PASSED");

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("==================================================");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
    process.exit(1);
  } finally {
    // Cleanup
    if (testHospitalId) {
      console.log("\nCleaning up test data...");
      await prisma.user.deleteMany({ where: { email: testEmail } });
      await prisma.hospital.deleteMany({ where: { id: testHospitalId } });
      console.log("✓ Test data cleaned up successfully.");
    }
    await prisma.$disconnect();
  }
}

runTests();
