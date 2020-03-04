NameColumn = 1;
EmailColumn = 2;
CheckinDateColumn = 3;
CheckoutDateColumn = 4;
SecondPaymentDate = 5;
AdultsColumn = 6;
ChildrenColumn = 7;
FirstPaymentColumn = 8;
SecondPaymentColumn = 9;
TotalPaymentColumn = 10;
ProposalEmailColumn = 11;
PartialPaymentEmailColumn = 12;
FullPaymentEmailColumn = 13;

ProposalEmailDateColumn = 17;
PartialPaymentEmailDateColumn = 18;
FullPaymentEmailDateColumn = 19;

var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheets()[0];



function createSpreadsheetOpenTrigger() {
   ScriptApp.newTrigger('sendEmailOnEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
    }