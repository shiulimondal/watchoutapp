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

const Refund = () => {
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
      li {
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
    <h1>1. SUBSCRIPTION FEEAND SUBSCRIPTION TERM</h1>

    <p>2. After successful creation of the Account, You will be required to pay a subscription fee for accessing the Service, depending on subscription package options as made available by Watchout from time-to-time (“Subscription Fee”). </p>

    <p>3. The Subscription Fees specified for each Subscription Plan are inclusive of applicable taxes.</p>

    <p>4. Watchout will be using third party payment gateways to process and facilitate the payment of the Subscription Fee.  On successful completion of the payment of the Subscription Fee, the Subscription Plan subscribed by You will become active and You will be granted access to the specific premium content categorized under “Subscribe Now” as part of the Service. In certain cases, post completion of the payment to the Subscription Fee, Your Service activation may be delayed due to operational reasons.</p>

    <P>5. The Subscription Plan opted by You will be applicable for a specified period (“Subscription Term”) which may be a month, a quarter, six months, one year, or as indicated on the platform, from the date You subscribed the Service. Service shall remain active for the relevant Subscription Term.</P>

    <P>6. You can access the status of Your subscription anytime through the “Profile” section under “Manage Subscription”.</P>

    <P>7. Watchout reserves the right to change, terminate or otherwise amend the subscription packages, Subscription Fees, and billing cycles at its sole discretion and at any time. Such amendments shall be effective upon posting on the Service. Your continued use of the Service shall be deemed to be Your conclusive acceptance of all such amendments. If You do not accept, or do not wish to be subject to such amendments, Your, sole recourse shall be to cancel Your membership and discontinue using the Service. </P>

    <P>8. In case of revision in the Subscription Fee for a particular membership plan for any extension or renewal period, Watchout will give You an advance notice of such revision whether by way of notification on the Service itself or through Your registered e-mail or registered mobile number (as the case may be). Your continued use of the Service posts such notification upon commencement of renewal or extension period, shall be construed as express acceptance of the revised Subscription Fees.</P>

    <P>9. To the maximum extent permitted under applicable law, the Subscription Fees billed are non-refundable irrespective of whether the Service have been availed by You or not, and there shall be no refunds or credits for partially used periods and/or unwatched content. Your subscription plan will continue to remain active till the end of the Subscription Term, irrespective of when You cancel the Service. Any request for change or cancellation in any Subscription Plan prior to the expiration of the current Subscription Term period will not entail You to a refund for any portion of the Subscription Fee paid by You for the unexpired period of the current Subscription Term. Any changes in the subscription plan opted by You is effective only after the expiry of the current Subscription Term for which You have already been billed. Accordingly, the Service as per revised plan opted by You shall be effective only after the expiry of the then current Subscription Term, subject to You making all necessary payments.</P>

    <P>10. Post cancellation of Your subscription, if You wish to re-subscribe to the Service, you may do so from “Profile” section under “Restore Subscription”.</P>

    <P>11. TERMS FOR BILLING, PAYMENT & CANCELLATION</P>

    <P>12. The Subscription Fee will be billed as per Your selected Payment Method (defined hereunder) for the Subscription Plan selected by You at the time of Account creation/ registration, and such Subscription Fee shall be effective from the beginning of Your Subscription Term or at the end of free trial period (not applicable for subscription through One Time Payment Option (defined hereunder)), as applicable, till the end of the Subscription Term, and on each subsequent renewal automatically (as per the Subscription Plan chosen by You) unless and until You cancel the Service, or the Service is otherwise suspended or discontinued, or the Subscription Plan/ Fee is amended/ modified by Us, pursuant to this User Agreement.  To see the commencement date for Your next renewal period or to cancel the Service, you need to visit the “Manage Subscription in the More Section” on Your Service.</P>

    <P>13. “Payment Method” shall mean a current, valid accepted payment method and shall include either: (a) the Approved Recurring Payment Options namely (i) Most major Credit Cards, or (ii) Most major Debit
    cards–; and  (iii) In app purchases through the listed third party web-sites/ service providers; or (b) One Time Payment Options (i.e. by way of UPI/Net banking/Wallet/ Prepaid cards Gift Card/Credit and Debit cards other than Approved Recurring Payment Options, as permitted by Watchout; or (c) such other payment methods accepted by Watchout, from time to time. The Approved Recurring Payment Options and One Time Payment Options shall be updated from time to time without any further notification. For certain Payment Methods, Your Payment Method service provider may charge You a transaction fee and/ or other charges. We request You to check with Your Payment Method service provider for details.</P>

   <P>14. Watchout will be automatically billing as per Your Payment Method as Approved Recurring Payment Options for each Subscription Term as per Your Subscription Plan on such day/ period corresponding to Your chosen Subscription Plan.  However, if You change Your Subscription Plan, this could result in changing the day/ period on which You are billed and the amount which You are billed. On changing Your existing Subscription plan to another plan, You would be required to pay the difference in rates (on a pro rata basis) for the new Subscription Plan selected and would be billed as per the new Subscription Plan from the next billing / renewal cycle, as the case maybe. The new Subscription Plan will be effective from the date on which You select such new plan and make appropriate payments as necessary.</P>

   <P>15. If a payment is not successfully settled, due to expiration, insufficient funds, or otherwise, you shall be able to access the Service only after You set up the revised Valid Payment Method and subject to receipt of the Subscription Fee by Us.</P>

   <P>16. You cannot change Your Payment Method during the tenure of a particular Subscription Term.  If Your selected Payment Method is no longer available/ valid, or expires or Your Payment Method fails for whatsoever reason, You authorize Us to continue billing, and You will continue to remain responsible and liable for any uncollected amounts together with all costs incurred by Watchout in connection with the collection of these amounts, including, without limitation, collection agency fees, attorney fees, court costs, etc. Without prejudice to the immediately preceding sentence, Watchout reserves the right to charge any of the alternate Payment Methods associated to Your Account in case Your Primary Payment Method is declined or no longer available to Us for payment, and/ or terminate the Subscription Plan offered to You. </P>

   <P>17. You also understand and acknowledge that Watchout only facilitates the third-party payment gateway for processing of payments. The third-party payment gateway service provider will require certain financial information including Your credit card /debit card or other banking information.  Other than providing a confirmation upon receipt of payment against a membership account, Watchout disclaims any and all liabilities in relation to Your payment processing by such third-party payment gateway service provider and the collection and processing of any information provided to third- party payment gateway service provider.  While using such payment gateways to make payments to Watchout, You will be abided by the user agreement/terms of use and privacy policies of such payment gateway service provider.  We request You to please make Yourself familiar with the user agreement/terms of use and privacy policies of Your respective payment gateway service provider before using such service.</P>

   <P>18. You are responsible for the accuracy and authenticity of the information provided by You, including the bank account number/credit card/UPI id details and any other information requested by the payment gateway service provider during the subscription process.  You represent and warrant that You have the right to use any of the card details or other payment information that You submit as part of Your chosen Payment Method. Watchout further clarifies that We do not receive or collect any of Your financial information including bank account number, credit card and/or debit card number, one-time-passwords sent by Your bank, passwords, bank customer IDs etc., and will not be responsible for misuse of such information by any- one.  You agree and acknowledge that Watchout shall not be liable and in no way be held responsible for any losses whatsoever, whether direct, indirect, incidental or consequential, including without limitation any losses due to delay in processing of payment instruction or any credit card/debit card/banking fraud.</P>

    <p>19.You can file any complaint related to payment processing by writing to Us directly on . <strong>support@watchout.net.in</strong> and the same will be forwarded to the concerned third party payment gateway provider for redressal.</p>

    <P>20. Upon payment through any of the Payment Method and confirmation of receipt of such payment from the payment gateway provider, an electronic invoice may be made available to You. </P>

    <P>21. If You have chosen a Subscription Plan to the Service, or are accessing the Service; through/using Your account/ membership with a third party as a Payment Method and wish to cancel Your Subscription Plan for the Service at any time, You may need to do so through such third party, for example by visiting Your membership/ account with the applicable third party and turning off auto-renew, and/ or unsubscribing from, the Service through that third party. You understand that the terms and conditions that may apply to You in such cases, may differ and may be as set forth by such third party, and governed by such third party’s applicable policies.</P>

    <P>22. If you are currently on an auto-renew subscription, your subscription will automatically renew unless you cancel it before the renewal date to avoid being billed for the subsequent subscription term. To ensure a seamless experience and continuous access to our paid service, we may initiate your payment up to 48 hours prior to the renewal date. We will attempt to charge your primary payment method for the subscription fee. If the primary payment method fails, we will attempt to charge any alternate payment methods you have provided. By default, you will be enrolled in an auto-renew subscription. You may change this default setting by [insert method here, e.g., accessing your account settings or contacting customer support]. If you are on a non-auto-renew subscription, you will need to make a new online payment at the end of the plan term to continue accessing the paid service.</P>

    <h1>23. TERMINATION</h1>

    <P>Without prejudice to the right of the Company to investigate and take appropriate legal action against anyone who, in the Company’s sole discretion, violates this User Agreement and/ or exercise any other rights and remedies available to the Company under applicable laws, the Company reserves the right to limit or restrict Your Account, and/ or deny, de-activate, suspend and/ or terminate Your access to all or part of the Service, at its sole discretion, with or without notice, and without liability either to Watchout or its directors, key managerial personnel, officers, employees, either: (i) for convenience; or (ii) for non-payment of the Subscription Fee or if payment is not successfully settled, due to expiration, insufficient funds, or otherwise or in case of a failure of all the Payment Methods; or (iii) for any suspected or actual breach/ violation by You of any of this User Agreement, the Privacy Policy, violation of any applicable law or if You have engaged in any inappropriate conduct, or provided false or inaccurate information; or (iv) for any other reason that Watchout deems fit. We further clarify that the Your access to Service gets automatically terminated in the event You breach any of the provisions of this User Agreement and/or the Privacy Policy. You hereby also agree that Watchout shall not, nor shall it be obliged to refund the Subscription Fee or any other amounts that You may have paid to access and/or use the Services, in case of the occurrence of any of the above instances. You acknowledge, agree and confirm that Watchout may take any one or more of the actions described above, without any notice to You, prior or otherwise, and You understand and agree that neither Watchout nor any of its affiliates shall have any liability to You or to any other person for any limitation, restriction, denial, de-activation, suspension and/ or termination of Your access to the Service or Your Subscription Plan, or any parts thereof and/or the removal, discarding, disabling or deactivation of any of Your User Materials or the removal, discarding, disabling or deactivation of any other information or data that You may have provided on or by means of the Service. </P>

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
                <Text style={styles.topHeader}>Cancellation and Refund</Text>
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

export default Refund;

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
