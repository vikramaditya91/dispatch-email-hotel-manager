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
        var ui = SpreadsheetApp.getUi();

      //Send the proposal email
      if(modifiedColumn == ProposalEmailColumn)
      {
        if(sheet.getRange(modifiedRow, ProposalEmailDateColumn).isBlank())
        {
          response = get_user_response_confirmation("proposal/before-payment", modifiedRow)
          if (response == ui.Button.YES) {
            sendProposalEmail(modifiedRow)
            sheet.getRange(modifiedRow, ProposalEmailDateColumn).setValue(now)
          }
        }        
      }   
      
      
      //Send the partial payment email
      if(modifiedColumn == PartialPaymentEmailColumn)
      {
        if(sheet.getRange(modifiedRow, PartialPaymentEmailDateColumn).isBlank())
        {
          response = get_user_response_confirmation("partial_payment_received", modifiedRow)
          if (response == ui.Button.YES) {
            partialPaymentEmail(modifiedRow)
            sheet.getRange(modifiedRow, PartialPaymentEmailDateColumn).setValue(now)
          }
        }        
      }
      
      
      //Send the booking confirmed email
      if(modifiedColumn == FullPaymentEmailColumn)
      {
        if(sheet.getRange(modifiedRow, FullPaymentEmailDateColumn).isBlank())
        {
          response = get_user_response_confirmation("booking confirmed", modifiedRow)
          if (response == ui.Button.YES) {
            bookingConfirmedEmail(modifiedRow)
            sheet.getRange(modifiedRow, FullPaymentEmailDateColumn).setValue(now)
          }
        }        
      }
    }   
  }
}

function get_user_response_confirmation(type_of_email_to_send, modifiedRow)
{
  var ui = SpreadsheetApp.getUi();
  [name, email, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] = get_required_data(modifiedRow)
  
  var response = ui.alert('Are you sure you want to send the ' + type_of_email_to_send + 'email to:\n'+
                          "name:" + name + "\n"+
                          "email:" + email + "\n"+
                          "checkin_date:" + checkin_date + "\n"+
                          "checkout_date:" + checkout_date + "\n"+
                          "adults:" + adults + "\n"+
                          "children:" + children + "\n"+
                          "first_payment_amount:" + first_payment_amount + "\n"+
                          "second_payment_amount:" + second_payment_amount + "\n"+
                          "second_payment date:" + pay_by_date + "\n"+
                          "total_payment_amount:" + total_payment_amount, ui.ButtonSet.YES_NO);
  return response
}

function get_required_data(row_number)
{
  //Gathers all the relevant data useful for generating a good email
  
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
  
  return [name, email, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount];  
}

function get_salutation(name)
{
  if(name!="")
  {
    return "Hi " + name;
  }
  else
  {
    return "";
  } 
}

function sendProposalEmail(row_number)
{
  
  [name, email, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] = get_required_data(row_number)
  
  var salutation = get_salutation(name);
  
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

function partialPaymentEmail(row_number)
{
  [name, email, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] = get_required_data(row_number)
  
  var salutation = get_salutation(name);
  
  var html = HtmlService.createTemplateFromFile('partialPaymentReceived');
  html.data = [salutation, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] ;
  var template = html.evaluate().getContent();
  
  MailApp.sendEmail({
    to: email,
    subject: 'Villa Casuarina: Partial Payment Received',
    htmlBody: template,
    replyTo:'ashoksvilla@gmail.com',
    name: "Villa Casuarina"
  }); 
}

function bookingConfirmedEmail(row_number)
{
  [name, email, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] = get_required_data(row_number)
  
  var salutation = get_salutation(name);
  
  var html = HtmlService.createTemplateFromFile('bookingConfirmed');
  html.data = [salutation, checkin_date, checkout_date, pay_by_date, adults, children, first_payment_amount, second_payment_amount, total_payment_amount] ;
  var template = html.evaluate().getContent();
  
  MailApp.sendEmail({
    to: email,
    subject: 'Villa Casuarina: Booking Confirmed',
    htmlBody: template,
    replyTo:'ashoksvilla@gmail.com',
    name: "Villa Casuarina"
  }); 
}


