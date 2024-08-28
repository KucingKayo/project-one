function reset_form() {
    $("#txcode").val('').focus();
    $("#txname").val('');
    $("#txid").val('');
    $("#txasuransi").val('');
    $("#txgaji").val('');
    $("#txtagihan").val('');
    $("#levelgroupCompPercent").val('');
    $("#levelgroupEmplPercent").val('');
  }


  function desimal(input) {
    var output = input
    if (parseFloat(input)) {
      input = new String(input); // so you can perform string operations
      var parts = input.split("."); // remove the decimal part
      parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
      output = parts.join(".");
    }
  
    return output;
  }

  function toggleValidation() {
    let selection = document.getElementById("txpersentamount").value;
    let inputField = document.getElementById("txpersenpokok");

    if (selection == "0") {
        // Mengubah label sesuai dengan pilihan persentase
        document.getElementById("label-persent-amount").innerText = "Persen Pokok / Perhari";
        inputField.placeholder = "Masukkan Berapa Persen";
    } else if (selection == "1") {
        // Mengubah label sesuai dengan pilihan amount
        document.getElementById("label-persent-amount").innerText = "Amount / Perhari";
        inputField.placeholder = "Masukkan Amount";
    }
}

function toggleValidation() {
  let selection = document.getElementById("txpersentamount").value;
  let inputField = document.getElementById("txpersenpokok");

  if (selection == "0") {
      // Update label and placeholder for percentage selection
      document.getElementById("label-persent-amount").innerText = "Persen Pokok / Perhari";
      inputField.placeholder = "Masukkan Berapa Persen";
  } else if (selection == "1") {
      // Update label and placeholder for amount selection
      document.getElementById("label-persent-amount").innerText = "Amount / Perhari";
      inputField.placeholder = "Masukkan Amount";
  }
}

function validateInput() {
  let selection = document.getElementById("txpersentamount").value;
  let inputField = document.getElementById("txpersenpokok");

  if (selection == "0") { 
      // Validate percentage input
      onmaxPersent(inputField, 100);
      onminPersent(inputField, 0);
  } else if (selection == "1") {
      // Validate amount input
      onmaxAmount(inputField);
      onminAmount(inputField);
  }
}

function onmaxPersent(input, max) {
  if (input.value > max) {
      input.value = max;
  }
}

function onminPersent(input, min) {
  if (input.value < min) {
      input.value = min;
  }
}

function onmaxAmount(input) {
  let amount = parseFloat(document.getElementById("txperhari").value.replace(/,/gi, "")) || 0;

  if (parseFloat(input.value) > amount) {
      input.value = amount;
  }
}

function onminAmount(input) {
  if (parseFloat(input.value) < 0) {
      input.value = 0;
  }
}


  
  // function onmax(input, max) {
  //   if (input.value > max) {
  //       input.value = max;
  //   }
  // }
  function onmin(input, min) {
    if (input.value < min) {
        input.value = min;
    }
  }
 
  function changenom() {
    var amt = parseFloat($('[name="levelgroupAmount"]').val().replace(/,/gi, ""));
  var div = parseFloat($('[name="levelgroupDivide"]').val().replace(/,/gi, ""));
  $('[name="levelgroupNominal"]').val("");
  if (amt > 0 && div > 0) {
    nom = parseInt(amt / div);
    $('[name="levelgroupNominal"]').val(desimal(nom));
  }
}

function coma(value) {
  value = (typeof value === "number" ? value.toString() : value).replace(/,/g, "");
  var parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}



function cekIsHalf() {
  console.log($('[name="levelgroupHalfDay"]').val());
  if ($('[name="levelgroupHalfDay"]').val() == "1") {
    $('[name="levelgroupHalfPercent"], [name="levelgroupHalfAmount"]').attr(
      "disabled",
      true
    );
  } else {
    $('[name="levelgroupHalfPercent"], [name="levelgroupHalfAmount"]').attr(
      "disabled",
      false
    );
  }
}

  
  function load_data() {
    $.post("golongan/load_data",
        {
  
        },
        function (data) {
            console.log(data)
            $("#table2").DataTable().clear().destroy()
            $("#table2 > tbody").html('');
            $.each(data.golongan, function (idx, val) {
                html = '<tr>'
                html += '<td>' + val['levelgroupCode'] + '</td>'
                html += '<td>' + val['levelgroupName'] + '</td>'
                html += '<td>' + val['levelgroupAmount'] + '</td>'
                html += '<td><span onclick="active_data(' + val['levelgroupId'] + ',' + val['levelgroupActive'] + ')" class="badge ' + ((val['levelgroupActive'] == '1') ? 'bg-success' : 'bg-danger') + ' ">' + ((val['levelgroupActive'] == '1') ? 'Active' : 'Inactive') + '</span></td>'
                html += '<td><button class="btn btn-warning btn-sm btn-edit"  onclick="edit_data(' + val['levelgroupId'] + ')">Edit</button></td>'
                html += '<td><button class="btn btn-danger btn-sm " onclick="hapus_data(' + val['levelgroupId'] + ')">Hapus</button></td>'
                html += '</tr>'
                $("#table2 > tbody").append(html);
            });
            
            $("#table2").DataTable({
                responsive: true,
                processing: true,
                pagingType: 'first_last_numbers',
                // order: [[0, 'asc']],
                dom:
                    "<'row'<'col-3'l><'col-9'f>>" +
                    "<'row dt-row'<'col-sm-12'tr>>" +
                    "<'row'<'col-4'i><'col-8'p>>",
                "language": {
                    "info": "Page _PAGE_ of _PAGES_",
                    "lengthMenu": "_MENU_",
                    "search": "",
                    "searchPlaceholder": "Search.."
                }
            });
  
        }, 'json');
  }
  function simpan_data() {
    let code = $("#txcode").val();
    let name = $("#txname").val();
    let nominal = $("#txtagihan").val();  // Hapus semua titik dari nominal
    let hari = $("#txhari").val();
    let perhari = $("#txperhari").val();  // Hapus semua titik dari total gaji
    let setengah = $("#setengah").val();  // Hapus semua titik dari halfgaji (jika perlu)
    let persen = $("#txpersentamount").val();  // Hapus semua titik dari gaji
    let pokok = $("#txpersenpokok").val();
    if (code === "" || name === ""|| nominal === "") {
        Swal.fire({
            title: 'Error!',
            text: "Ada Form belum dimasukkan!!!",
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } else {
        $.post("golongan/create", {
          txcode: code,
          txname: name,
          txtagihan: nominal,
          txhari: hari,
          txperhari: perhari,  // Sesuaikan nama variabel dengan yang digunakan dalam PHP
          setengah: setengah,
          txpersentamount: persen,
          txpersenpokok: pokok,
        },
            function (data) {
                console.log(data.status);
                if (data.status === "error") {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Success!',
                        text: data.msg,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    reset_form();
                }
            }, 'json');
    }
  }
  function update_data()
  {
  var id = $("#loginModal").data('id');
  let levelgroupCode = $("#txcode").val();
  let levelgroupName = $("#txname").val();
  let levelgroupAmount = $("#txtagihan").val();
  let levelgroupDivide = $("#txhari").val();
  let levelgroupNominal = $("#txperhari").val();
  let levelgroupHalfDay = $("#txsetengah").val();
  let levelgroupHalfPercent = $("#txpersentamount").val();
  let levelgroupHalfAmount = $("#txpersenpokok").val();
  
  if (levelgroupCode === "" || levelgroupName === ""|| levelgroupAmount === ""){
    Swal.fire({
      title: 'Error!',
      text: data.msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }else{
    $.post('golongan/update_table', { id: id, levelgroupCode: levelgroupCode, levelgroupName: levelgroupName, levelgroupAmount: levelgroupAmount, levelgroupDivide: levelgroupDivide, levelgroupNominal: levelgroupNominal, levelgroupHalfDay: levelgroupHalfDay, levelgroupHalfPercent: levelgroupHalfPercent, levelgroupHalfAmount: levelgroupHalfAmount}, function(data) {
      if (data.status === 'success') {
        Swal.fire({
          title: 'Success!',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          load_data();
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.msg,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
  }, 'json');
  }}
  function edit_data(id) {
    $.post('golongan/edit_table', { id: id }, function (data) {
        if (data.status === 'ok') {
          $("#txcode").val(data.data.levelgroupCode);
          $("#txname").val(data.data.levelgroupName);
          $("#txtagihan").val(data.data.levelgroupAmount);
          $("#txhari").val(data.data.levelgroupDivide);
          $("#txperhari").val(data.data.levelgroupNominal);
          $("#txsetengah").val(data.data.levelgroupHalfDay);
          $("#txpersentamount").val(data.data.levelgroupHalfPercent);
          $("#txpersenpokok").val(data.data.levelgroupHalfAmount);
            $("#loginModal").data('id', id); 
            $("#loginModal").modal('show');
            $(".btn-submit").hide();
            $(".btn-editen").show();
  
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.msg,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
    }, 'json');
  }
  
  function hapus_data(id) {
    Swal.fire({
        title: 'Apakah kamu ingin menghapus data?',
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Yes',
        customClass: {
            actions: 'my-actions',
            cancelButton: 'order-1 right-gap',
            confirmButton: 'order-2',
            denyButton: 'order-3',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('golongan/delete_table', { id: id }, function (data) {
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Succes!',
                        text: data.msg,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        load_data();
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                }
            }, 'json');
        } else if (result.isDenied) {
            Swal.fire('Perubahan tidak tersimpan', '', 'info')
        }
    })
  }
  function active_data(id, status) {
    if (status == 1) {
      Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda Ingin MENONAKTIFKAN data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Nonaktifkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          $.post('golongan/active', { id: id }, function(data) {
            if (data.status === 'success') {
              Swal.fire({
                title: 'Success!',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                $("#loginModal").modal('hide');
                load_data();
              });
            } else {
              Swal.fire({
                title: 'Gagal!',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }, 'json');
        }
      });
    } else {
      Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda Ingin MENGAKTIFKAN data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Aktifkan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          $.post('levelgroup/active', { id: id }, function(data) {
            if (data.status === 'success') {
              Swal.fire({
                title: 'Sukses!',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                $("#loginModal").modal('hide');
                load_data();
              });
            } else {
              Swal.fire({
                title: 'Gagal!',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }, 'json');
        }
      });
    }
  }
  
  $(document).ready(function () {
    $(".btn-closed").click(function () {
        reset_form()
    });
  
    $(".btn-add").click(function () {
        reset_form();
        $(".btn-submit").show();
        $(".btn-editen").hide();
    })
    $(".btn-add").click(function () {
        $(".btn-submit").show();
        $(".btn-editen").hide();
    })
    $(".page-title").html("levelgroup")
    $(".tit").html("levelgroup")

    $("body").on('keyup','.angka.des',function(e){
      if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
        this.value = this.value.replace(/[^0-9\.]/g, '');
      }
      $(this).val(desimal($(this).val()));
    });

    $("body").on('focus','.angka',function(e){
      $(this).select();
    });
  
    load_data();
  }); 