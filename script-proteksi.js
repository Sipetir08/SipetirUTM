/* Feather Icon Access */ 
feather.replace();

/* Menyembunyikan Hasil Perhitungan Proteksi */
document.getElementById('output').style.display = 'none'; // menyembunyikan tampilan section result

/* Memeriksa Data Kolom Input */
document.getElementById('in-panjang').addEventListener('input', function(event) {
  const inputP = this.value;
  
  // Cek apakah input bukan angka
  if (isNaN(inputP)) {
    Swal.fire({
      icon: 'error',
      title: 'Input Panjang tidak valid',
      text: 'Harap masukkan angka saja!',
    });
    this.value = ''; // Kosongkan input jika bukan angka
  }
});

document.getElementById('in-lebar').addEventListener('input', function(event) {
  const inputL = this.value;
  
  // Cek apakah input bukan angka
  if (isNaN(inputL)) {
    Swal.fire({
      icon: 'error',
      title: 'Input Lebar tidak valid',
      text: 'Harap masukkan angka saja!',
    });
    this.value = ''; // Kosongkan input jika bukan angka
  }
});

document.getElementById('in-tinggi').addEventListener('input', function(event) {
  const inputT = this.value;
  
  // Cek apakah input bukan angka
  if (isNaN(inputT)) {
    Swal.fire({
      icon: 'error',
      title: 'Input Tinggi tidak valid',
      text: 'Harap masukkan angka saja!',
    });
    this.value = ''; // Kosongkan input jika bukan angka
  }
});

/* Deklarasi Variabel Global */
let panjang, lebar, tinggi, curahpetir, Ae, roundAe, Ng, roundNg, Nd, roundNd, Nc, E, roundE, 
    protect, radiusm, I, roundI, Ax,roundAx, E_Ax, roundEAx, alpha, roundAlpha, extraProteksi;

/* Fungsi untuk menghitung nilai proteksi berdasarkan data input*/
function calculateProteksi(){
  // Ambil nilai dari input
  panjang = parseFloat(document.getElementById('in-panjang').value);
  lebar = parseFloat(document.getElementById('in-lebar').value);
  tinggi = parseFloat(document.getElementById('in-tinggi').value);
  curahpetir = parseFloat(document.getElementById('guruh-daerah').value);
  unsurbahan = parseFloat(document.getElementById('bahan').value);

  // menghitung nilai Ae (area cakupan bangunan)
  // Aa = ab + 6h*(a+b) + 9(phi)(h^2)
  Ae = (panjang*lebar) + (6*tinggi*panjang) + (6*tinggi*lebar) + (9*Math.PI*tinggi**2);
  roundAe = Ae.toFixed(2);  //membatasi 2 angka di belakang koma

  //menghitung nilai Ng (kerapatan samabaran petir)
  // Ng = 0.04) * Td^(1.25)
  Ng = 0.04 * curahpetir**(1.25);
  roundNg = Ng.toFixed(2); //membatasi 2 angka di belakang koma

  //menghitung nilai Nd (rata-rata samabaran petir)
  // Nd = Ng * Ae * 10^(-6)
  Nd = Ng * Ae * (10**(-6));
  roundNd = Nd.toFixed(2); //membatasi 2 angka di belakang koma

  //menghitung nilai efisiensi
  // E = 1-(Nc/Nd)
  Nc = 0.1;
  E = 1 - (Nc/Nd);
  roundE = E.toFixed(2); //membatasi 2 angka di belakang koma
  if (E<0){
    E = 0; 
    roundE = "Tidak Perlu Proteksi";
    document.getElementById('efisiensi').style.fontSize = "1.7rem";
  } else {document.getElementById('efisiensi').style.fontSize = "2.5rem";}

  //menghitung tingkat proteksi berdasarkan tabel nilai Efisiensi
  let intProtect;
  if (roundE >= 0.98) {protect = "Proteksi I"; intProtect = 1;}
  else if (roundE >= 0.95 && roundE < 0.98) {protect = "Proteksi II"; intProtect = 2;}
  else if (roundE >= 0.90 && roundE < 0.95) {protect = "Proteksi III"; intProtect = 3;}
  else {protect = "Proteksi IV"; intProtect = 4;}

  //menghitung radius proteksi dengan metode rolling sphere
  //menentukan nilai R(m) dari tabel rolling sphere
  radiusm;
  if (intProtect == 1){radiusm = 20;}
  else if (intProtect == 2){radiusm = 30;}
  else if (intProtect == 3){radiusm = 45;}
  else{radiusm = 60;}

  //menghitung arus maksimal yang dapat disalurkan sistem proteksi
  I = Math.pow(radiusm, 1/0.75);
  roundI = I.toFixed(2); //membatasi 2 angka di belakang koma

  //menghitung luas area terproteksi
  Ax = Math.PI * (radiusm**2);
  roundAx = Ax.toFixed(2);

  //menghitung luas area tidak terproteksi
  let Atotal = panjang * lebar;
  let roundA = Atotal.toFixed(2);
  E_Ax = roundA - roundAx;
  roundEAx = E_Ax.toFixed(2);
  if (E_Ax < 0){E_Ax = 0; roundEAx = 0;}

  //menghitung sudut lindung
  alpha = (Math.asin(1-(tinggi/radiusm))) * (180/Math.PI);
  roundAlpha = alpha.toFixed(2);
  if (alpha < 0){roundAlpha = 0;}

  //menghitung tambahan penyalur petir
  extraProteksi = parseInt(roundA / roundAx);

  //menentukan terminasi udara dan down conductor
  if (unsurbahan == 1){termUdara = 35; downCon = 16;} 
  else if (unsurbahan == 2){termUdara = 70; downCon = 25;}
  else{termUdara = 50; downCon = 50;}

}

/* Fungsi mengunduh PDF */
document.getElementById('unduh').addEventListener('click', function(event) {
  // Inisialisasi jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // Lebar halaman
  const pageHeight = doc.internal.pageSize.getHeight(); // Tinggi halaman

  console.log(`Lebar: ${pageWidth}, Tinggi: ${pageHeight}`);

  // memasukkan gambar logo
  const imgData = 'logo-petir.png'; // Masukkan string base64 dari gambar Anda
  doc.addImage(imgData, 'PNG', 10, 10, 15, 15); // Format, x, y, lebar, tinggi
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("SI PETIR DOCUMENT", 30, 20);  

  // Mengatur ukuran teks dan font
  // nilai max (x,y) pada A4 adalah (595.28, 814.89)
  doc.setFontSize(24);
  doc.setFont("times", "bold");
  doc.text("Data Hasil Perhitungan", 105, 40, {align: "center"});
  doc.text("Kebutuhan Sistem Penangkal Petir", 105, 50, {align: "center"});

  calculateProteksi();
  const daerahSelect = document.getElementById('guruh-daerah');
  const selectedText = daerahSelect.options[daerahSelect.selectedIndex].text; // mengambil nama daerah terpilih
  
  // Tambahkan teks ke PDF sesuai posisi x, y
  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.text(`Panjang Bangunan`, 10, 65); doc.text(`: ${panjang} m`, 45, 65)
  doc.text(`Lebar Bangunan`, 10, 75);   doc.text(`: ${lebar} m`, 45, 75);
  doc.text(`Tinggi Bangunan`, 10, 85);  doc.text(`: ${tinggi} m`, 45, 85);
  doc.text(`Lokasi Bangunan`, 10, 95);  doc.text(`: ${selectedText}`, 45, 95);
  doc.text(`Hari Guruh`, 10, 105);      doc.text(`: ${curahpetir} Hari`, 45, 105);

  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text("Hasil Perhitungan Sistem Proteksi, antara lain:", 10, 120);

  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.text(`Area Ekivalen`, 10, 130);           doc.text(`: ${roundAe} m²`, 55, 130);
  doc.text(`Rerata Kerapatan Petir`, 10, 140);  doc.text(`: ${roundNg} Km²/Tahun`, 55, 140);
  doc.text(`Rerata Sambaran Petir`, 10, 150);   doc.text(`: ${roundNd} /Tahun`, 55, 150);
  doc.text(`Efisiensi Proteksi`, 10, 160);      doc.text(`: ${roundE}`, 55, 160);
  doc.text(`Tingkat Proteksi`, 10, 170);        doc.text(`: ${protect}`, 55, 170);
  doc.text(`Radius Proteksi`, 10, 180);         doc.text(`: ${radiusm} m`, 55, 180);
  doc.text(`Arus Maksimal Sistem`, 10, 190);    doc.text(`: ${roundI} /kA`, 55, 190);
  doc.text(`Area Terproteksi`, 10, 200);        doc.text(`: ${roundAx} m²`, 55, 200);
  doc.text(`Area Tidak Terproteksi`, 10, 210);  doc.text(`: ${roundEAx} m²`, 55, 210);
  doc.text(`Sudut Lindung Proteksi`, 10, 220);  doc.text(`: ${roundAlpha} °`, 55, 220);
  doc.text(`Penyalur Tambahan`, 10, 230);       doc.text(`: ${extraProteksi} unit`, 55, 230);
  doc.text(`Min-Size Bahan Terminasi Udara`, 10, 240);    doc.text(`: ${termUdara} mm²`, 70, 240);
  doc.text(`Min-Size Konduktor Penyalur`, 10, 250);       doc.text(`: ${downCon} mm²`, 70, 250);

  // Simpan PDF dengan nama file
  doc.save("DataPerhitunganProteksi.pdf");
});

document.getElementById('calculate').addEventListener('click', function(event) {
  const inputs = document.querySelectorAll('.inputField');
  let allFilled = true;

  //memeriksa kolom yang belum terisi
  inputs.forEach(input => {
    if (input.value.trim() === '') {
      allFilled = false;
    }
  });

  if (!allFilled) {
    // Mencegah form terkirim jika ada input yang kosong
    event.preventDefault();
    Swal.fire("Ada Kolom yang Belum Terisi!");
  }
  else{
    document.getElementById('output').style.display = 'block'; // tampilkan section Output
    
    window.location.href = '#output'; // Mengarahkan ke halaman kuis
    calculateProteksi(); // Menampilkan hasil ketika tombol submit diklik
    // Tampilkan hasil di box output
    document.getElementById('box-Ae').innerHTML = roundAe + " m<sup>2</sup>"; //Tampilkan hasil Ae
    document.getElementById('box-Ng').innerHTML = roundNg + " Km<sup>2</sup>/Tahun"; //Tampilkan hasil Ng
    document.getElementById('box-Nd').innerHTML = roundNd + " /Tahun";  //Tampilkan hasil Nd
    document.getElementById('efisiensi').innerHTML = roundE;  //Tampilkan hasil efisiensi
    document.getElementById('tingkat-proteksi').innerHTML = protect;  //Tampilkan hasil tingkat proteksi
    document.getElementById('radius-proteksi').innerHTML = radiusm + " m";  //Tampilkan radius proteksi
    document.getElementById('arus-max').innerHTML = roundI + " /kA";  //Tampilkan hasil arus maksimal
    document.getElementById('area-proteksi').innerHTML = roundAx + " m<sup>2</sup>"; //Tampilkan hasil area terproteksi
    document.getElementById('area-nonproteksi').innerHTML = roundEAx + " m<sup>2</sup>"; //Tampilkan hasil area tidak terproteksi
    document.getElementById('sudut-lindung').innerHTML = roundAlpha + " °";  //Tampilkan hasil Nd
    document.getElementById('tambahan-sistem').innerHTML = extraProteksi + " unit";  //Tampilkan hasil Nd
    document.getElementById('terminasi-udara').innerHTML = termUdara + " mm<sup>2</sup>";  //Tampilkan hasil terminasi udara
    document.getElementById('down-conductor').innerHTML = downCon + " mm<sup>2</sup>";  //Tampilkan hasil down conductor
  }

  });
