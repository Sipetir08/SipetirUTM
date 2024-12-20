/* Feather Icon Access */ 
feather.replace();

/* Kuisioner BackEnd Section Start */ 
document.getElementById('result').style.display = 'none'; // menyembunyikan tampilan section result
document.getElementById('gotoProteksi').style.display = 'none'; // menyembunyikan tampilan section goto proteksi

document.getElementById('start-button').addEventListener('click', function() {
  window.location.href = '#quiz'; // Mengarahkan ke halaman kuis
});


// Fungsi untuk menghitung total score
function calculateScore() {
  let isFormValid = true;
  // Inisialisasi total skor
  let totalScore = 0;

  // Memeriksa Pertanyaan 1
  const question1 = document.querySelector('input[name="answer1"]:checked');
    if (!question1) {
        document.getElementById('error1').style.display = 'block';
        isFormValid = false;
    } else {
        document.getElementById('error1').style.display = 'none';
        totalScore += parseInt(question1.value, 10); // Tambahkan nilai ke total skor
        isFormValid = true;
    }

  // Memeriksa Pertanyaan 2 
  const question2 = document.querySelector('input[name="answer2"]:checked');
    if (!question2) {
        document.getElementById('error2').style.display = 'block';
        isFormValid = false;
    } else {
        document.getElementById('error2').style.display = 'none';
        totalScore += parseInt(question2.value, 10); // Tambahkan nilai ke total skor
        isFormValid = true;
    }
  
  // Memeriksa Pertanyaan 3
  const question3 = document.querySelector('input[name="answer3"]:checked');
    if (!question3) {
        document.getElementById('error3').style.display = 'block';
        isFormValid = false;
    } else {
        document.getElementById('error3').style.display = 'none';
        totalScore += parseInt(question3.value, 10); // Tambahkan nilai ke total skor
        isFormValid = true;
    }

  // Memeriksa Pertanyaan 4
  const question4 = document.querySelector('input[name="answer4"]:checked');
    if (!question4) {
        document.getElementById('error4').style.display = 'block';
        isFormValid = false;
    } else {
        document.getElementById('error4').style.display = 'none';
        totalScore += parseInt(question4.value, 10); // Tambahkan nilai ke total skor
        isFormValid = true;
    }
  
    // Memeriksa Pertanyaan 5
  const question5 = document.querySelector('input[name="answer5"]:checked');
    if (!question5) {
        document.getElementById('error5').style.display = 'block';
        isFormValid = false;
    } else {
        document.getElementById('error5').style.display = 'none';
        totalScore += parseInt(question5.value, 10); // Tambahkan nilai ke total skor
        isFormValid = true;
    }

  if(isFormValid){
    document.getElementById('result').style.display = 'block'; // tampilkan section result
  } else{
    document.getElementById('result').style.display = 'none';
  }

  return totalScore;   
}

// Fungsi untuk menampilkan hasil setelah submit
function showResult() {
  // Menghitung skor total
  const score = calculateScore();
  
  // Menentukan level bahaya berdasarkan skor
  let resultText;
  if (score < 11) {
    resultText = "DIABAIKAN. Sehingga bangunanmu TIDAK PERLU pengamanan dari sistem penangkal petir";
  } else if (score == 11) {
    resultText = "KECIL. Sehingga bangunanmu TIDAK PERLU pengamanan dari sistem penangkal petir";
  } else if (score == 12) {
    resultText = "SEDANG. Sehingga bangunanmu CUKUP DISARANKAN menggunakan pengamanan dari sistem penangkal petir";
    document.getElementById('gotoProteksi').style.display = 'block';
  } else if (score == 13){
    resultText = "CUKUP BESAR. Sehingga bangunanmu DISARANKAN menggunakan pengamanan dari sistem penangkal petir";
    document.getElementById('gotoProteksi').style.display = 'block';
  } else if (score == 14){
    resultText = "BESAR. Sehingga bangunanmu SANGAT DISARANKAN menggunakan pengamanan dari sistem penangkal petir";
    document.getElementById('gotoProteksi').style.display = 'block';
  } else{
    resultText = "SANGAT BESAR. Sehingga bangunanmu SANGAT MEMBUTUHKAN pengamanan dari sistem penangkal petir";
    document.getElementById('gotoProteksi').style.display = 'block';
  }

  // Menampilkan skor dan hasil ke dalam elemen #result
  document.querySelector('#result .box-score').textContent = score;
  document.querySelector('#result p').textContent = `Berdasarkan skor hasil kuisioner yang kamu dapatkan, perkiraan bahaya terhadap bangunanmu menunjukkan indeks ${resultText}`;
}

// Event listener untuk tombol submit
document.getElementById('submit').addEventListener('click', function(event) {
  //mencegah reload page otomatis
  event.preventDefault();

  // Inisialisasi status form
  let isFormValid = true;

  const questionGroups = ["answer1", "answer2", "answer3", "answer4", "answer5"];
  for (let group of questionGroups) {
    if (!document.querySelector(`input[name="${group}"]:checked`)) {
      // Jika ada satu grup yang belum dijawab, kembalikan false
      isFormValid = false;
    }
  }

  if(isFormValid){
    document.getElementById('result').style.display = 'block'; // tampilkan section result
    
    window.location.href = '#result'; // Mengarahkan ke halaman kuis
    showResult(); // Menampilkan hasil ketika tombol submit diklik
  }
  else{Swal.fire("Ada Pertanyaan yang Belum Terisi!");}
});
/* Kuisioner BackEnd Section End */ 
