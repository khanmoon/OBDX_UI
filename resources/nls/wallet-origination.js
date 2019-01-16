define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        forgotPassword: {
          buttons: {
            continueButton: "Continue",
            resendButton: "Resend Code",
            logInButton: "Login"
          },
          messages: {
            enterDetails: "Okay, no problem. Just enter the details below.",
            usernamePlaceholder: "Please enter your email ID",
            enterOtp: "A verification code has been sent to your registered mobile number.  Please enter that code below to complete the process",
            successMessage: "Successful!",
            confirmationMessage: "Your password has been reset",
            password: "Enter at least 8 characters including a number, one uppercase and lowercase letter.",
            verification: "Verification",
            enterPassword: "Please enter your new password",
            otpValidation: "Invalid OTP",
            passwordMatch: "The Password must match!"
          },
          verification: {
            verificationLabel: "Verification Code"
          },
          details: {
            passwordLabel: "Password",
            forgotUserName: "Don't remember your username?",
            codeNotReceived: "Didn't get the code",
            dobLabel: "Date of Birth",
            newPasswordLabel: "New Password",
            reEnterPasswordLabel: "Re-enter Password"
          },
          header: {
            signUpLabel: "Sign up"
          }
        },
        wallet: {
          header: "wallets",
          signuptitle: "Quick and Easy Payments!",
          signup: "Sign up",
          login: "Login",
          forgotpassword: "Forgot Password ?",
          forgotpasswordtitle: "Forgot Password",
          enterdetails: "Okay, no problem. Just enter the details below.",
          username: "Username",
          newtobank: "New to Bank ?",
          receivecodemsg: "Please enter your mobile number to receive the verification code",
          mobilenumber: "Mobile Number",
          receivecodetext: "Receive Code",
          verifymobile: "Verify Mobile",
          verifyemail: "Verify Email",
          signupmsg: "Your Wallet is just a few clicks away.",
          verificationcodemsg: "Please enter your verification code",
          resendcode: "Resend Code",
          info: "Info",
          infodescription: "Please share your personal information.",
          salutation: "Salutation",
          firstName: "First Name",
          lastName: "Last Name",
          gender: "Gender",
          email: "Email",
          mobileNumber: "Mobile Number",
          dateOfBirth: "Date of Birth",
          resendMsg: "OTP can be send for maximum 3 times only",
          codeResendMsg: "OTP sent again",
          pwdNoMatch: "Password and confirm password does not match",
          confirmPassword: "Confirm Password",
          andMuchMore: "...and much more!",
          receive: "Receive",
          pay: "Pay",
          jobs: "Pay | Receive | Save | Transfer",
          declaration: "You now own a digital wallet!",
          congratulations: "Congratulations !",
          getStarted: "Get Started",
          properties: "Simple, Quick and Secure",
          verificationcodeemailmsg: "Check your Email Id for verification code",
          origination: {
            label: {
              header: "Wallets By Rook Bank",
              signup: "Sign up",
              login: "Login",
              forgotPassword: "Forgot Password ?",
              mobileVerification: "Mobile Verification",
              codeVerification: "Enter Verification Code",
              userDetails: "User Details",
              emailverification: "Email Verification",
              created: "Wallet"
            },
            enterCode: {
              title: "Your Wallet is just a few clicks away.",
              textBoxHeading: "Please enter the verification code",
              button: "Continue"
            }
          },
          OPTverification: Generic.OPTverification
          /*{
          												verification: 'Verify',
          												message: 'A verification code has been sent to your registered mobile number. Please enter tha code below to complete the process',
          												verificationcode: 'Verification Code',
          												resendcode: 'Resend Code',
          												resendcode_msg: 'Did not get the code?'
          										}*/
        },
        messages: Messages,
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new OriginationLocale();
});
