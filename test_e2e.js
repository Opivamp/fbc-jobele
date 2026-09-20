const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('====================================================');
  console.log('  FIRST BAPTIST CHURCH JOBELE - E2E TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    process.stdout.write(`Testing: ${name.padEnd(50)} `);
    try {
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      failed++;
    }
  }

  // 1. Test Public Routes
  const publicRoutes = [
    '/',
    '/about',
    '/leadership',
    '/ministries',
    '/sermons',
    '/events',
    '/gallery',
    '/news',
    '/plan-your-visit',
    '/give',
    '/prayer',
    '/contact',
    '/sitemap.xml',
    '/robots.txt'
  ];

  for (const route of publicRoutes) {
    await check(`Public Route: ${route}`, async () => {
      const res = await fetch(`${BASE_URL}${route}`);
      if (res.status !== 200) {
        throw new Error(`Expected HTTP 200 but got ${res.status}`);
      }
    });
  }

  // 2. Test Search API
  await check('Public Search API for "Worship"', async () => {
    const res = await fetch(`${BASE_URL}/api/public/search?q=worship`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error('Search returned no results');
    }
  });

  // 3. Test Confidential Prayer Request Submission
  let testPrayerId = '';
  await check('Confidential Prayer Request Submission', async () => {
    const res = await fetch(`${BASE_URL}/api/public/prayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sister Folake Balogun',
        email: 'folake@example.com',
        phone: '+234 803 111 2222',
        request: 'Praying for safe journey mercies and divine wisdom in exams.',
        category: 'Spiritual Growth',
        isAnonymous: false,
        preferredContact: 'phone'
      })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.id) throw new Error('Failed to create prayer request');
    testPrayerId = data.id;
  });

  // 4. Test Public Contact Submission
  await check('Public Contact Form Submission', async () => {
    const res = await fetch(`${BASE_URL}/api/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Brother Kehinde',
        email: 'kehinde@example.com',
        phone: '+234 802 333 4444',
        subject: 'Inquiring about Wedding Service',
        message: 'We are planning our church wedding ceremony at FBC Jobele and wish to speak with the pastor.'
      })
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Failed to submit contact');
  });

  // 5. Test Admin Login & Session
  let authCookie = '';
  await check('Admin Login (Super Admin)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin@fbcjobele.org',
        password: 'JobeleFaith2026!'
      })
    });
    if (res.status !== 200) throw new Error(`Login failed with status ${res.status}`);
    const setCookie = res.headers.get('set-cookie');
    if (!setCookie) throw new Error('No set-cookie header received');
    authCookie = setCookie.split(';')[0];
    const data = await res.json();
    if (data.user?.role !== 'superadmin') throw new Error('Role mismatch');
  });

  // 6. Test Admin Session Verification
  await check('Admin Session Verification (/api/admin/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/me`, {
      headers: { Cookie: authCookie }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.authenticated || data.user.email !== 'admin@fbcjobele.org') {
      throw new Error('Session invalid');
    }
  });

  // 7. CRITICAL TEST: Admin Gallery Upload & Instant Public Visibility
  let uploadedImgId = '';
  await check('CRITICAL: Admin Photo Upload to Live Gallery', async () => {
    // Create a mock image buffer for upload
    const testImageBuffer = fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'brand', 'logo.jpg'));
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    
    // Construct multipart form-data payload manually
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="dedication_service_test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const field1 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nMilestones & Dedications`;
    const field2 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nDedication of Sanctuary Improvements`;
    const field3 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\nCelebrating the dedication of new pews and sound equipment at FBC Jobele.`;
    const field4 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="photographer"\r\n\r\nChurch Media Unit\r\n--${boundary}--\r\n`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(header, 'utf8'),
      testImageBuffer,
      Buffer.from(field1 + field2 + field3 + field4, 'utf8')
    ]);

    const res = await fetch(`${BASE_URL}/api/admin/gallery/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Cookie: authCookie
      },
      body: bodyBuffer
    });

    if (res.status !== 200) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    if (!data.success || !data.images || data.images.length === 0) {
      throw new Error('Upload response missing images');
    }
    uploadedImgId = data.images[0].id;
    console.log(`\n      Uploaded Photo URL: ${data.images[0].imageUrl}`);
  });

  // 8. Verify Newly Uploaded Photo Immediately Appears in Public Gallery
  await check('CRITICAL: Verify Uploaded Photo is in Public Gallery API', async () => {
    const res = await fetch(`${BASE_URL}/api/public/gallery`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const found = data.images.find(img => img.id === uploadedImgId);
    if (!found) {
      throw new Error(`Uploaded image ${uploadedImgId} was NOT found in public gallery!`);
    }
    if (found.title !== 'Dedication of Sanctuary Improvements') {
      throw new Error('Uploaded image title does not match');
    }
  });

  // 9. Verify Confidential Prayer Request is Visible on Pastoral Desk
  await check('Verify Confidential Prayer in Pastoral Admin Desk', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/prayers`, {
      headers: { Cookie: authCookie }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const found = data.prayerRequests.find(p => p.id === testPrayerId);
    if (!found) throw new Error(`Prayer request ${testPrayerId} not found in admin!`);
  });

  // 10. Update Site Settings in Admin and Verify
  await check('Update Site Settings & Real-Time Reflection', async () => {
    const updateRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({
        tagline: 'Sanctuary of Divine Power - Living Faith'
      })
    });
    if (updateRes.status !== 200) throw new Error(`Status ${updateRes.status}`);

    const getRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { Cookie: authCookie }
    });
    const data = await getRes.json();
    if (data.settings.tagline !== 'Sanctuary of Divine Power - Living Faith') {
      throw new Error('Settings tagline not updated');
    }

    // Restore original tagline
    await fetch(`${BASE_URL}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie
      },
      body: JSON.stringify({
        tagline: 'Sanctuary of Divine Power'
      })
    });
  });

  // 11. Test Admin Staff Registration Page
  await check('Public Admin Register Page (/admin/register)', async () => {
    const res = await fetch(`${BASE_URL}/admin/register`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 12. Test Staff Registration - Rejection on Invalid Passcode
  await check('Staff Registration: Rejects with Invalid Security Passcode', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Intruder User',
        email: 'intruder@example.com',
        username: 'intruder',
        password: 'Password123!',
        role: 'content_admin',
        passcode: 'WRONG_UNAUTHORIZED_PASSCODE'
      })
    });
    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden but received ${res.status}`);
    }
    const data = await res.json();
    if (!data.error || !data.error.includes('Invalid Church Staff Security Passcode')) {
      throw new Error('Expected invalid passcode error message');
    }
  });

  // 13. Test Staff Registration - Success with Valid Church Passcode
  const testStaffEmail = `staff_${Date.now()}@fbcjobele.org`;
  let registeredCookie = '';
  await check('Staff Registration: Creates Authorized Account & Logs In', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bro. Oluwaseun Davies',
        email: testStaffEmail,
        username: `seun_${Date.now()}`,
        password: 'ChurchPass2026!',
        role: 'content_admin',
        passcode: 'FBC-JOBELE-COVENANT-2026'
      })
    });
    if (res.status !== 200) {
      const errText = await res.text();
      throw new Error(`Registration failed: ${res.status} ${errText}`);
    }
    const setCookie = res.headers.get('set-cookie');
    if (!setCookie) throw new Error('No set-cookie header received');
    registeredCookie = setCookie.split(';')[0];
    const data = await res.json();
    if (!data.success || data.user.email !== testStaffEmail) {
      throw new Error('Registration user mismatch');
    }
  });

  // 14. Verify Newly Registered Staff Session
  await check('Verify New Registered Staff Session (/api/admin/auth/me)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/me`, {
      headers: { Cookie: registeredCookie }
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.authenticated || data.user.email !== testStaffEmail) {
      throw new Error('Registered user session verification failed');
    }
  });

  console.log('\n====================================================');
  console.log(`  E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
