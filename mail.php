<?php
//LINK:: https: //github.com/PHPMailer/PHPMailer

use PHPMailer\PHPMailer\PHPMailer;

$data = file_get_contents("php://input");

$body = $data;

$to = "forallweb000@gmail.com";
$to2 = "jossarif00@gmail.com";

$subject = "Check Email Template";

//Get require file
require_once "PHPMailer/PHPMailer.php";
require_once "PHPMailer/SMTP.php";
require_once "PHPMailer/Exception.php";

//Initiate PHPMailer Class
$mail = new PHPMailer();

//Smtp Settings
$mail->isSMTP();
$mail->Host = "smtp.gmail.com";
$mail->SMTPAuth = true;
$mail->Username = $to;
$mail->Password = "forall000BD00@#$%Mt";
$mail->Port = 465; //587
$mail->SMTPSecure = "ssl";

//Recipients
$mail->setFrom($to, "Mithu Khan");
$mail->addAddress($to);
$mail->addAddress($to2);

//Contents
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $body;
$mail->AltBody = $body;

//Proccess Error
if ($mail->send()) {
  $status = "Success";
  $response = "Email is sent";
} else {
  $status = "Failed";
  $response = "Something went wrong. " . $mail->ErrorInfo;
}

exit(json_encode(
  ["status" => $status, "response" => $response]
));
?>