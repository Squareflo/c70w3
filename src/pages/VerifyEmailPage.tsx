// Add this debugging code to your VerifyEmailPage.tsx handleVerificationSubmit function
// Right before the verification request

const requestBody = { 
  email: formData.email,
  code: verificationCode,
  userData: {
    firstName: formData.firstName,
    lastName: formData.lastName,
    city: formData.city,
    phoneNumber: formData.phoneNumber,
    password: formData.password
  }
};

console.log('Debug - Form data from sessionStorage:', formData);
console.log('Debug - Request body being sent:', {
  email: requestBody.email,
  code: requestBody.code,
  userData: { ...requestBody.userData, password: '[REDACTED]' }
});

// Verify all required fields are present
const requiredFields = ['firstName', 'lastName', 'city', 'phoneNumber', 'password'];
const missingFields = requiredFields.filter(field => !formData[field]);
if (missingFields.length > 0) {
  console.error('Missing required fields:', missingFields);
  toast({
    title: "Missing Information",
    description: `Missing: ${missingFields.join(', ')}`,
    variant: "destructive",
  });
  return;
}
