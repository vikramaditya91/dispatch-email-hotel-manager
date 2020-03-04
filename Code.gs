function sendEmailOnEdit(e) {
  
  var range = e.range;
  Logger.log("The modified range is " + range);
  var modifiedColumn = range.getColumn();
  var modifiedRow = range.getRow();
  Logger.log("The row " +  range.getRow() + " was modified on the column " + range.getColumn());
  Logger.log("The value set on the modified column was " + range.getValue());  
  if(range.getValue() == "1")
  {
    if(validateFilledItems(modifiedRow))
    {
      var now = new Date();
      
      //Send the proposal email
      if(modifiedColumn == ProposalEmailColumn)
      {
        if(sheet.getRange(modifiedRow, ProposalEmailDateColumn).isBlank())
        {
          sendProposalEmail(modifiedRow)
          // sheet.getRange(modifiedRow, NoPaymentEmailDateColumn).setValue(now)
        }        
      }    
    }   
  }
}

function sendProposalEmail(row_number)
{
  var relevant_values = sheet.getRange(row_number, 1, 1, 10).getValues();
  var name = relevant_values[0][0];
  var email = relevant_values[0][1];
  var checkin_date_raw = relevant_values[0][2];
  var checkout_date_raw = relevant_values[0][3];
  var pay_by_date_raw = relevant_values[0][4];

  var checkin_date = date_formatter(checkin_date_raw);
  var checkout_date = date_formatter(checkout_date_raw);
  var pay_by_date = date_formatter(pay_by_date_raw)
  
  var adults = relevant_values[0][5];
  var children = relevant_values[0][6];
  var first_payment_amount = relevant_values[0][7];
  var second_payment_amount = relevant_values[0][8];
  var total_payment_amount = relevant_values[0][9];
  
  
  if(name!="")
  {
    var salutation = "Hi " + name;
  }
  else
  {
    var salutation = "";
  }
  
  var html = HtmlService.createTemplateFromFile('sendProposal');
  html.data = [salutation, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] ;
  var template = html.evaluate().getContent();
  
  MailApp.sendEmail({
    to: email,
    subject: 'Your reservation request at Villa Casuarina',
    htmlBody: template,
    replyTo:'ashoksvilla@gmail.com',
    name: "Villa Casuarina"
  }); 
}


