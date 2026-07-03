# Security Specification & "Dirty Dozen" Payload Tests

## 1. Data Invariants
1. **Membership Registration**: A membership application cannot be updated by anyone except an authorized admin. Status can only transition between "Pending", "Approved", and "Rejected".
2. **Team Member Application**: A team member application cannot have its role or category edited by the applicant once submitted; only an admin can approve/reject and assign these roles.
3. **Inquiries**: Anyone can create an inquiry, but inquiries cannot be read, updated, or deleted by anyone except authorized administrators.
4. **Site Settings**: Only authorized administrators can update site settings.
5. **Blog & News Posts**: Anyone can read published blog posts, but only administrators can create, update, or delete blog posts.
6. **Testimonials**: Anyone can read approved testimonials and submit new ones (with a default status of "Pending"). Only administrators can approve or delete testimonials.
7. **FAQs**: Anyone can read FAQs, but only administrators can manage (create, update, delete) them.

---

## 2. The "Dirty Dozen" Malicious Payloads
Here are 12 JSON payloads designed to break system invariants, with each expected to return `PERMISSION_DENIED`:

### Test 1: Self-Approving Membership Application
* **Path**: `/memberships/mem_123` (as non-admin user)
* **Payload**:
  ```json
  {
    "fullName": "Imposter User",
    "email": "imposter@gmail.com",
    "status": "Approved"
  }
  ```
* **Vulnerability Target**: State Shortcut / Escalation.

### Test 2: Ghost Field Injection in Inquiry
* **Path**: `/inquiries/inq_999`
* **Payload**:
  ```json
  {
    "fullName": "Attacker",
    "email": "attacker@gmail.com",
    "subject": "Spam",
    "message": "Hello",
    "ghostFieldOverride": "VULNERABILITY"
  }
  ```
* **Vulnerability Target**: Schema Poisoning / Ghost Field Injection.

### Test 3: Unauthorized Read of Administrative Inquiries
* **Operation**: List / Get on `/inquiries` (as anonymous/non-admin user)
* **Vulnerability Target**: PII Leak / Unauthorized Read.

### Test 4: Modifying Immutable 'createdAt' Field in Membership
* **Path**: `/memberships/mem_1` (Update as owner/user)
* **Payload**:
  ```json
  {
    "fullName": "SARITA ADHIKARI",
    "submittedAt": "2020-01-01T00:00:00Z"
  }
  ```
* **Vulnerability Target**: Temporal Integrity / Immutability Violation.

### Test 5: Self-Assigning Admin Role (Self-Promote)
* **Path**: `/admins/some_user_id` (by non-admin `some_user_id`)
* **Payload**:
  ```json
  {
    "email": "hacker@gmail.com",
    "isAdmin": true
  }
  ```
* **Vulnerability Target**: Privilege Escalation.

### Test 6: Over-sized String Injection (Denial of Wallet)
* **Path**: `/inquiries/inq_123`
* **Payload**:
  ```json
  {
    "fullName": "A".repeat(1000000),
    "email": "test@gmail.com",
    "subject": "DoS",
    "message": "Huge message"
  }
  ```
* **Vulnerability Target**: Resource Exhaustion.

### Test 7: State Shortcutting a Published Blog Post
* **Path**: `/blogs/blog_1` (by anonymous user trying to publish or delete)
* **Payload**:
  ```json
  {
    "title": "Malicious Article",
    "content": "Hack content",
    "status": "Published"
  }
  ```
* **Vulnerability Target**: Unauthenticated write.

### Test 8: Modifying Another Person's Membership Application
* **Path**: `/memberships/mem_other` (by user `user_abc` who is not the owner or admin)
* **Payload**:
  ```json
  {
    "fullName": "Tampered Name"
  }
  ```
* **Vulnerability Target**: Identity Spoofing.

### Test 9: Bypass Validation with Empty Subject Inquiry
* **Path**: `/inquiries/inq_empty`
* **Payload**:
  ```json
  {
    "fullName": "Name",
    "email": "test@gmail.com",
    "subject": "",
    "message": "Inquiry text"
  }
  ```
* **Vulnerability Target**: Empty value validator bypass.

### Test 10: Injecting Invalid Rating in Testimonials
* **Path**: `/testimonials/test_123`
* **Payload**:
  ```json
  {
    "name": "User",
    "message": "Nice site",
    "rating": 9999
  }
  ```
* **Vulnerability Target**: Domain constraints validation.

### Test 11: Attempting to Delete Administrative Settings Singleton
* **Path**: `/siteSettings/current` (by non-admin)
* **Operation**: Delete
* **Vulnerability Target**: Administrative System lockout.

### Test 12: Injecting Malicious Document ID Paths
* **Path**: `/memberships/../../../etc/passwd`
* **Payload**:
  ```json
  {
    "fullName": "Poison ID"
  }
  ```
* **Vulnerability Target**: Path Traversal / Poison ID Guard.

---

## 3. Security Rule Specification & Test Runner Layout
A test suite runner script would be configured to run in a local emulator, verifying that each of the "Dirty Dozen" payloads above throws a `PERMISSION_DENIED` error. All schemas are fully guarded in `firestore.rules`.
