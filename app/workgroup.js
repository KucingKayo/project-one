function reset_form() {
    $("#txnama").val('').focus();

  }
  
  function active_data(id, status) {
    $.confirm({
      title: 'Ubah status',
      content: 'Yakin ingin mengubah status?',
      theme: 'dark',
      buttons: {
        Ubah: function () {
          if (status === 1) {
            $.post('workgroup/active', { id: id, status: status }, function (data) {
              if (data.status === 'success') {
                $.dialog({
                  title: 'Status Diubah!',
                  content: 'status berhasil di non-aktifkan',
                  theme: 'dark',
                });
                $("#loginModal").modal('hide');
              } else {
                alert(data.msg);
              }
              load_data()
            }, 'json')
          } else {
            if (status === 0) {
              $.post('workgroup/active', { id: id, status: status }, function (data) {
                if (data.status === 'success') {
                  $.dialog({
                    title: 'Status Diubah!',
                    content: 'status berhasil di aktifkan',
                    theme: 'dark',
                  });
                  $("#loginModal").modal('hide');
                } else {
                  alert(data.msg);
                }
                location.reload();
              }, 'json')
            }
          }
        },
        Batal: function () {
          $.alert('Batal mengubah status');
        }
      }
    }
    )
  };
  
  function simpan_data() {

    let name = $("#txnama").val();
  
    if ( name === "") {
      alert("Pastikan form diisi dengan benar!");
    } else {
      $.post("workgroup/create", {
        txnama: name,
 
      },
        function (data) {
          console.log(data.status);
          if (data.status === "error") {
            alert(data.msg)
          } else {
            alert(data.msg)
            $("#loginModal").modal('hide');
            load_data()
            reset_form(); // Reset the form after successful save
          }
        }, 'json');
    }
  }
  
  function edit_data(id) {
    $.post('workgroup/edit_table', { id: id }, function (data) {
      if (data.status === 'ok') {
        $("#txnama").val(data.data.workgroupName);
        $("#loginModal").data('id', id);
        $("#loginModal").modal('show');
        $(".btn-submit").hide();
        $(".btn-editen").show();
  
      } else {
        $("#loginModal").modal('hide');
        alert(data.msg);
      }
    }, 'json');
  }
  
  function editkuy() {
    var id = $("#loginModal").data('id');
    let workgroupName = $("#txnama").val();

  
    if ( workgroupName === "") {
      $.alert({
        title: 'Alert!',
        content: 'Error',
    });
    } else {
      $.post('workgroup/update_table', { id: id,  workgroupName: workgroupName, }, function (data) {
        if (data.status === 'success') {
          alert(data.msg);
          load_data()
        } else {
          alert(data.msg);
  
        }
      }, 'json');
    }
  }
  

  
  function load_data() {
    $.post("workgroup/load_data",
      {
  
      },
      function (data) {
        console.log(data)
        $("#table3").DataTable().clear().destroy()
  
        $("#table3 > tbody").html('');
        $.each(data.workgroup, function (idx, val) {
          html = '<tr>'
          html += '<td>' + val['workgroupName'] + '</td>'
          html += '<td><span onclick="active_data(' + val['workgroupId'] + ',' + val['workgroupActive'] + ')"  class="badge  ' + ((val['workgroupActive'] == '1') ? 'bg-success' : 'bg-danger') + ' ">' + ((val['workgroupActive'] == '1') ? 'Active' : 'Inactive') + '</span></td>'
          html += '<td><button class="btn btn-warning btn-sm btn-edit"  onclick="edit_data(' + val['workgroupId'] + ')">Edit</button></td>'
          html += '<td><button class="btn btn-danger btn-sm" onClick="confirmDelete(' + val['workgroupId'] + ')">Delete</button></td>'
          html += '</tr>'
          $("#table3 > tbody").append(html);
        });
        
        $("#table3").DataTable({
          responsive: true,
          processing: true,
          pagingType: 'first_last_numbers',
          order: [[0, 'desc']],
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
  
  function confirmDelete(id) {
    $.confirm({
      title: 'Konfirmasi!',
      content: 'Yakin ingin menghapus data?',
      theme: 'dark',
      buttons: {
        ya: function () {
          $.post('workgroup/delete_table', { id: id }, function (data) {
            if (data.status === 'success') {
              $.dialog({
                title: 'Data dihapus!',
                content: 'data berhasil dihapus',
                theme: 'dark',
              });
              $("#loginModal").modal('hide');
            } else {
              // alert(data.msg);
            }
            load_data()
          }, 'json')
        },
        batal: function () {
          $.alert('Batal menghapus!');
        }
      }
    })
  };
  

  
  
  $(document).ready(function () {
    $(".tittle").html("Absensi-GroupKerja")
    $(".page-title").html("Group Kerja")
    $(".tit").html("Group Kerja")
    $(".btn-add").click(function () {
      $(".btn-submit").show();
      $(".btn-editen").hide();
      reset_form()
    })
    $(".btn-closed").click(function () {
      reset_form()
    });
    load_data();
  })