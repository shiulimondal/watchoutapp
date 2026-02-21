import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import HTML from "react-native-render-html";

const PrivacyPolicy = () => {
  const router = useRouter();
  const privacyPolicy = `
 <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #ffffff;
        background-color: #000000;
        margin: 20px;
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
    <h1>Privacy Policy</h1>
    <p>
      Welcome to Watchout's Privacy Policy ("Policy"). This Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or engage with our services (collectively, the "Service"). Please read this Policy carefully. If you do not agree with the terms of this Policy, please do not access the Service.
    </p>

    <h1>1. Information We Collect</h1>
    <p>
      We may collect information about you in a variety of ways. The types of information we may collect include:
    </p>
    <p>
      <strong>Personal Data:</strong> Personally identifiable information such as your name, email address, phone number, and payment information that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.
    </p>
    <p>
      <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.
    </p>
    <p>
      <strong>Financial Data:</strong> Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Service.
    </p>
   

    <h1>2. Use of Your Information</h1>
    <p>
      We use the information we collect in the following ways:
    </p>
    <ul>
      <li>To provide and manage the Service.</li>
      <li>To process your transactions and send you related information.</li>
      <li>To manage your account and provide customer support.</li>
      <li>To improve our Service and develop new products and services.</li>
      <li>To communicate with you, including sending you updates, newsletters, and promotional materials.</li>
      <li>To monitor and analyze usage and trends to enhance your experience with the Service.</li>
    </ul>

    <h1>3. Disclosure of Your Information</h1>
    <p>
      We may share information we have collected about you in certain situations:
    </p>
     <p>
      <strong>For Legal Purposes:</strong> We may share your information with third-party service providers who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, and hosting services.
    </p>
    <p>
      <strong>With Service Providers:</strong> We may disclose your information if required to do so by law or in response to legal requests and legal process (e.g., subpoenas or court orders)
    </p>
    <p>
      <strong>Business Transfers:</strong> We may disclose or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
    </p>
    <p>
      <strong>With Your Consent:</strong> We may disclose your information for any other purpose disclosed to you at the time we collect the information or with your consent.
    </p>
  

    <h1>4. Security of Your Information</h1>
    <p>
      We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
    </p>

    <h1>5. Your Data Protection Rights</h1>
    <p>
      Depending on your location, you may have the following rights regarding your personal data:
    </p>
    <ul>
      <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
      <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate or complete information you believe
      is incomplete.</li>
      <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
      <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
      <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>
      <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
    </ul>
    <p>
      If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our provided contact information.
    </p>

    <h1>6. Cookies and Tracking Technologies</h1>
    <p>
      We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Service and improve your experience. When you access the Service, your personal information may be collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Service.
    </p>

    <h1>7. Third-Party Websites</h1>
    <p>
      The Service may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Service, any information you provide to these third parties is not covered by this Policy, and we cannot guarantee the safety and privacy of your information. Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information.
    </p>

    <h1>8. Children's Privacy</h1>
    <p>
      We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have collected personal information from a child under age 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us at our provided contact information.
    </p>

    <h1>9. Changes to This Privacy Policy</h1>
    <p>
      We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. If we make material changes to this Privacy Policy, we will notify you by prominently posting a notice of such changes on our website or through the Service, and we will indicate when such changes will become effective.
    </p>

    <h1>10. Contact Us</h1>
    <p>
      If you have any questions or concerns about this Privacy Policy, the practices of the Service, or your dealings with the Service, please contact us at:
    </p>
    <p>
      <strong>Email:</strong> ottwatchout@gmail.com<br />
      <strong>Address:</strong> Kolkata
    </p>

    <span>Watchout Team</span>
  </body>
</html>

   `;

  return (
    <View style={styles.container}>
      <View
        style={{
          marginVertical: 20,
          paddingBottom: 0,
          paddingTop: 25,
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={25} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.topHeader}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HTML
          source={{ html: privacyPolicy }}
          contentWidth={100}
          tagsStyles={{
            h1: styles.title,
            h2: styles.sectionTitle,
            p: styles.paragraph,
            strong: styles.bold,
            span: styles.span,
            ul: styles.ul,
            li: styles.li,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
  ul: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  li: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: "white",
  },
});
