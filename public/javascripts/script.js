function openAdminLogin() {
    document.getElementById("adminLogin").style.display = "block";
}
  
function closeAdminLogin() {
    document.getElementById("adminLogin").style.display = "none";
}
  
function openAdminSignup() {
    document.getElementById("adminSignup").style.display = "block";
}

function closeAdminSignup() {
    document.getElementById("adminSignup").style.display = "none";
}

document.getElementById('downloadBtn').addEventListener('click', function() {
    const qrCode = document.getElementById('qrCode');
    const qrCodeUrl = qrCode.src;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr_code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

