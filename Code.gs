function onEdit(e) {

  var range = e.range;
  Logger.log("The modified range is " + range)
  var modifiedColumn = range.getColumn()
  var modifiedRow = range.getRow()
  Logger.log("The row " +  range.getRow() + " was modified on the column " + range.getColumn());
  Logger.log("The value set on the modified column was " + range.getValue());  
  if(modifiedColumn == PartialConfirmationUserColumn)
  {
    Logger.log("The PartialConfirmationUerColumn was modified");
    if(range.getValue() == "1")
    {
      if(validateFilledItems(modifiedRow))
         {
         Logger.log("The values in the row are validated and ready to send email")
         }    
     }   
   }
}

function validateEmail(email)
{
  //Validates the email with regex. Does not confirm whether the email really exists or not
  //Returns true/false depending on validity
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase()) 
}

function validateDateAfterToday(date_range)
{
  //Validates that the date is after today. Returns bool if the date is in the future
  var now = new Date();
  return (date_range.getValue() > now) 
}


function validateFilledItems(row_number)
{
  //Validates the contents of the row. If the contents of the row (email-address, checkin date and checkout date are valid, it returns true. false otherwise
  var email = sheet.getRange(row_number, EmailColumn).getValue();  
  if(validateEmail(email))
  {
    Logger.log("The email is valid")
    checkinRange = sheet.getRange(row_number, CheckinDateColumn);  
    checkoutRange = sheet.getRange(row_number, CheckoutDateColumn);  

    if((checkinRange.isBlank() == false) && (checkoutRange.isBlank() == false))
    {
      Logger.log("The checkin date is:" + checkinRange.getValue())
      Logger.log("The checkout date is:" + checkoutRange.getValue())
      if((validateDateAfterToday(checkinRange)) && (validateDateAfterToday(checkoutRange)))
      {
        return true
      }
    } 
  }
  return false
}
