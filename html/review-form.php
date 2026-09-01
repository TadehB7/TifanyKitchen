<?php
	$errorMSG = "";

	//FIRST NAME
	if (empty($_POST["firstName"])) {
		$errorMSG = "First Name is required";
	} else {
		$fname = $_POST["firstName"];
	}
    //URL
    if (empty($_POST["url"])) {
		$errorMSG .= "URL is required";
	} else {
		$url = $_POST["url"];
	}
	// EMAIL
	if (empty($_POST["email"])) {
		$errorMSG .= "Email is required";
	} else {
		$email = $_POST["email"];
	}
	// MESSAGE
	if (empty($_POST["message"])) {
		$errorMSG .= "Message is required";
	} else {
		$msg = $_POST["message"];
	}

	$subject = 'Enquiry from TiffanyKitchen Website';
    
	$EmailTo = "enquiry@tiffanykitchenhtml.com"; // Your domain email

	$headers = "From: noreply@wpthemeverse.com\r\n"; // Use domain email
	$headers .= "Reply-To: " . $email . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

	$Body = "<strong>Name:</strong> " . $fname . "<br>";
	$Body .= "<strong>Email:</strong> " . $email . "<br>";
    $Body .= "<strong>URL: </stong>" . $url."<br>";
	$Body .= "<strong>Message:</strong> " . nl2br($msg) . "<br>";

	$success = mail($EmailTo, $subject, $Body, $headers);

	//Show Message
	if ($success == 1 && $errorMSG == ""){
	   echo "success";
	}else{
		if($errorMSG == ""){
			echo "Something went wrong :(";
		} else {
			echo $errorMSG;
		}
	}

?>