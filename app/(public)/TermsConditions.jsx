import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import HTML from "react-native-render-html";

const TermsConditions = () => {
    const router = useRouter();

    const termsConditions = `
 <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #000000;
        margin: 10px;
        padding: 0;
      }
      h1,
      h2 {
        color: #ffffff;
      }
      h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      h2 {
        font-size: 19px;
        font-weight: 600;
        margin: 10px 0;
      }
      p {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 10px;
      }
      strong {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <h1>1. Introduction</h1>
    <p>
      Welcome to Watchout (the "Service"). These terms and conditions ("Terms")
      govern your use of our OTT service, including our website, mobile
      application, and any other related services (collectively, the "Service").
      By accessing or using the Service, you agree to comply with and be bound
      by these Terms. If you do not agree with these Terms, you should not use
      the Service.
    </p>

    <h1>2. Account Registration</h1>
    <p>
      <strong>Eligibility:</strong> You must be at least 18 years old to use the
      Service.
    </p>
    <p>
      <strong>Account Information:</strong> You must provide accurate and
      complete information when creating an account. You are responsible for
      maintaining the confidentiality of your account information and for all
      activities that occur under your account.
    </p>
    <p>
      <strong>Account Security:</strong> You agree to notify us immediately of
      any unauthorized use of your account.
    </p>

    <h1>3. Subscription and Billing</h1>
    <p>
      <strong>Subscription Plans:</strong> The Service offers various
      subscription plans. Details of these plans, including pricing and
      features, are provided at the time of subscription.
    </p>
    <p>
      <strong>Billing:</strong> By subscribing to the Service, you agree to pay
      the subscription fees and any applicable taxes. Subscription fees are
      billed in advance on a recurring basis according to the selected
      subscription plan.
    </p>
    <p>
      <strong>Payment Methods:</strong> We accept various payment methods, as
      specified on our website. You authorize us to charge your selected payment
      method for the subscription fees.
    </p>
    <p>
      <strong>Cancellation and Refunds:</strong> You can cancel your
      subscription at any time. If you cancel, your subscription will continue
      until the end of the current billing period, and you will not receive a
      refund for any prepaid fees.
    </p>

    <h1>4. Use of the Service</h1>
    <p>
      <strong>License:</strong> We grant you a limited, non-exclusive,
      non-transferable, and revocable license to access and use the Service for
      personal, non-commercial purposes.
    </p>
    <p><strong>Prohibited Activities:</strong></p>
    <p>
      You agree not to use the Service for any illegal or unauthorized purpose.
      Modify, distribute, or reproduce any content from the Service. Use any
      automated system, such as robots or spiders, to access the Service.
      Interfere with the proper functioning of the Service.
    </p>

    <h1>5. Content</h1>
    <p>
      <strong>Ownership:</strong> All content on the Service, including but not
      limited to videos, images, and text, is owned by or licensed to us. You
      agree not to use any content from the Service without our prior written
      permission.
    </p>
    <p>
      <strong>User-Generated Content:</strong> If you submit any content to the
      Service, you grant us a worldwide, non-exclusive, royalty-free license to
      use, reproduce, and distribute your content.
    </p>

    <h1>6. Privacy</h1>
    <p>
      Your use of the Service is also governed by our Privacy Policy, which is
      incorporated into these Terms by reference. Please review our Privacy
      Policy to understand our practices regarding your personal information.
    </p>

    <h1>7. Termination</h1>
    <p>
      We reserve the right to terminate or suspend your account and access to
      the Service at our sole discretion, without prior notice, for conduct that
      we believe violates these Terms or is harmful to other users of the
      Service, us, or third parties.
    </p>

    <h1>8. Disclaimer of Warranties</h1>
    <p>
      The Service is provided on an "as is" and "as available" basis. We do not
      warrant that the Service will be uninterrupted, error-free, or free of
      viruses or other harmful components.
    </p>

    <h1>9. Limitation of Liability</h1>
    <p>
      To the fullest extent permitted by law, we will not be liable for any
      indirect, incidental, special, consequential, or punitive damages, or any
      loss of profits or revenues, whether incurred directly or indirectly, or
      any loss of data, use, goodwill, or other intangible losses, resulting
      from (a) your use or inability to use the Service; (b) any unauthorized
      access to or use of our servers and/or any personal information stored
      therein.
    </p>

    <h1>10. Governing Law</h1>
    <p>
      These Terms shall be governed by and construed in accordance with the laws
      of [Your Jurisdiction], without regard to its conflict of law principles.
    </p>

    <h1>11. jurisdiction</h1>
    <p>
     By accessing or using our OTT platform, users agree that any disputes, claims, or legal proceedings arising out of or in connection with the use of the platform shall be subject to the exclusive jurisdiction of Kolkata High Court, West Bengal, India. These Terms of Service shall be governed and construed in accordance with the laws of India. Users acknowledge and consent that any legal matters will be resolved under Kolkata High Court legal jurisdiction, regardless of the user’s location.
    </p>

    <h1>12. Changes to Terms</h1>
    <p>
      We reserve the right to modify these Terms at any time. If we make
      changes, we will notify you by revising the date at the top of these Terms
      and, in some cases, we may provide additional notice (such as adding a
      statement to our homepage or sending you a notification).
    </p>

    <h1>13. Contact Us</h1>
    <p>
      If you have any questions about these Terms, please contact us at [Your
      Contact Information].
    </p>

    <span>Watchout Team</span>
  </body>
</html>

  `;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={25} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.topHeader}>Terms and Conditions</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <HTML
                    source={{ html: termsConditions }}
                    contentWidth={100}
                    tagsStyles={{
                        h1: styles.title,
                        h2: styles.sectionTitle,
                        p: styles.paragraph,
                        strong: styles.bold,
                        span: styles.span,
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
        padding: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 0,
        paddingTop: 25,
        paddingBottom: 15,
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        fontStyle: "italic",
    },
    topHeader: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    scrollContainer: {
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 0,
        color: Colors.dark.secondary,
        marginTop: 20,
        fontStyle: "italic",
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "600",
        marginVertical: 10,
        color: "white",
        fontStyle: "italic",
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 0,
        color: "white",
        fontStyle: "italic",
    },
    bold: {
        fontWeight: "bold",
        color: Colors.dark.secondary,
        fontStyle: "italic",
    },
    span: {
        color: Colors.dark.secondary,
        marginVertical: 20,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "italic",
    },
    footer: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
        color: "white",
        fontStyle: "italic",
    },
});

export default TermsConditions;
