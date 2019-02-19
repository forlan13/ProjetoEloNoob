/* Rota Para criação de pagamento
 * essa rota vai configurar e criar uma requesição de pagamento
*/
const express = require('express');
const paypal = require('paypal-rest-sdk');
const { mode, client_id, client_secret } = require('../../config/payment.json');


// Configuração do Pagamento
paypal.configure({
  mode,
  client_id,
  client_secret,
});


const router = express.Router();

router.post('/pay', (req, res) => {
  const { pay } = req.body;

  // Configuração do pagamento
  const create_payment_json = {
    "intent": "sale",
    "payer": { 
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/payment/success",
        "cancel_url": "http://localhost:3000/payment/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "NoobElo",
                "sku": "001",
                "price": "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "Seja Noob com Elo alto"
    }]
  };
  // Criação do pagamento
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
});

router.get('/success', (req, res) => {
  const { PayerID, paymentId } = req.query;

  const execute_payment_json = {
    "payer_id": PayerID,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.send('Success');
    }
  });
});

router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = app => app.use('/payment', router);
