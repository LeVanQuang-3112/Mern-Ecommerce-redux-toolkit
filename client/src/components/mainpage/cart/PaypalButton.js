import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
 
export default class PaypalButton extends React.Component {
    render() {
        const onSuccess = (payment) => {
            		console.log("The payment was succeeded!", payment);
                    this.props.tranSuccess(payment)            
        }
 
        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
        }
 
        const onError = (err) => {
            console.log("Error!", err);
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.props.total; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
 
        const client = {
            sandbox:    'AQDiHtv_iD7oWyY_pG736pnx0Z5brZqvXq_HMVdRaoCNWrZ4uOeODxW4ayzGxd3_AjjXdcWWlhuXaDMJ',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        let style = {
            size: 'small',
            color: 'blue',
            shape: 'rect',
            label: 'checkout',
            tagline: false
        }

        return (
            <PaypalExpressBtn 
                env={env} 
                client={client} 
                currency={currency}
                total={total} 
                onError={onError} 
                onSuccess={onSuccess} 
                onCancel={onCancel} 
                style={style}
            />
        );
    }
}