$(document).ready(function() {
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('#back-to-top').fadeIn();
    } else {
      $('#back-to-top').fadeOut();
    }
  });
});

document.querySelectorAll('#back-to-top, .list-group-item-action').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

$(function () {
    $('.selectpicker').selectpicker();
});

$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

$('.form-save').on('click', function(e) {
  e.preventDefault();
  var currentElement = $(this);
  var form = $(this).parents('form');
  form.attr('action', currentElement.attr('formaction'));
  Swal.fire({
    title: 'Modello correttamente salvato',
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      form.submit();
    }
  });
})

$('.form-create').on('click', function(e) {
  e.preventDefault();
  var form = $(this).parents('form')
  Swal.fire({
    title: 'Nuova versione correttamente creata',
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      form.submit();
    }
  });
})

$('.form-undo').on('click', function(e) {
  e.preventDefault();
  var currentElement = $(this);
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Se continui perderai le modifiche non salvate",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = currentElement.attr('href');
    }
  })
});

$('.form-validation').on('click', function(e) {
  e.preventDefault();
  var currentElement = $(this);
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Se continui perderai le modifiche non salvate",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = currentElement.attr('href');
    }
  })
});

$('.form-elimina-utente').on('click', function(e) {
  e.preventDefault();
  var form = $(this).parents('form');
  Swal.fire({
    title: 'Sei sicuro?',
    text: "I modelli associati all'utente andranno irrimediabilmente persi",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Utente correttamente eliminato',
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          form.submit();
        }
      });
    }
  })
});

$('.form-elimina-modello').on('click', function(e) {
  e.preventDefault();
  var form = $(this).parents('form');
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Non potrai più recuperare il modello né le versioni precedenti",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Modello correttamente eliminato',
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          form.submit();
        }
      });
    }
  })
});

$('.form-restore-and-delete').on('click', function(e) {
  e.preventDefault();
  var form = $(this).parents('form');
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Se hai già 3 versioni precedenti compresa questa, la versione più vecchia verrà eliminata",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Versione ripristinata correttamente',
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          form.submit();
        }
      });
    }
  })
});

$('.form-create-and-delete').on('click', function(e) {
  e.preventDefault();
  var form = $(this).parents('form');
  Swal.fire({
    title: 'Sei sicuro?',
    text: "Hai già 3 versioni precedenti, la versione più vecchia verrà eliminata",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b92828',
    cancelButtonColor: 'grey',
    confirmButtonText: 'Continua',
    cancelButtonText: 'Annulla'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Nuova versione creata correttamente',
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          form.submit();
        }
      });
    }
  })
});

$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})

$(function() {
  $('.tabSupport').on('keydown', function(e) {
    if (e.keyCode == 9 || e.which == 9) {
      e.preventDefault();
      var s = this.selectionStart;
      $(this).val(function(i, v) {
        return v.substring(0, s) + "\t" + v.substring(this.selectionEnd)
      });
      this.selectionEnd = s + 1;
    }
  });
});

$('#collapse1').on('show.bs.collapse', function() {
  $("#roles_documents_icon").empty().append('&#8689;');
  $("#roles_documents_div").addClass('shadowed');
});

$('#collapse1').on('hide.bs.collapse', function() {
  $("#roles_documents_icon").empty().append('&#8690;');
  $("#roles_documents_div").removeClass('shadowed');
});

$('#collapse2').on('show.bs.collapse', function() {
  $("#activities_icon").empty().append('&#8689;');
  $("#activities_div").addClass('shadowed');
});

$('#collapse2').on('hide.bs.collapse', function() {
  $("#activities_icon").empty().append('&#8690;');
  $("#activities_div").removeClass('shadowed');
});

$('#collapse3').on('show.bs.collapse', function() {
  $("#traces_workspaces_icon").empty().append('&#8689;');
  $("#traces_workspaces_div").addClass('shadowed');
});

$('#collapse3').on('hide.bs.collapse', function() {
  $("#traces_workspaces_icon").empty().append('&#8690;');
  $("#traces_workspaces_div").removeClass('shadowed');
});

$('#collapse4').on('show.bs.collapse', function() {
  $("#errors_icon").empty().append('&#8689;');
  $("#errors_div").addClass('shadowed');
  $("#errors_div_warning").addClass('shadowed');
});

$('#collapse4').on('hide.bs.collapse', function() {
  $("#errors_icon").empty().append('&#8690;');
  $("#errors_div").removeClass('shadowed');
  $("#errors_div_warning").removeClass('shadowed');
});

$('#collapse5').on('show.bs.collapse', function() {
  $("#2d_rappresentation_icon").empty().append('&#8689;');
  $("#2d_rappresentation_div").addClass('shadowed');
});

$('#collapse5').on('hide.bs.collapse', function() {
  $("#2d_rappresentation_icon").empty().append('&#8690;');
  $("#2d_rappresentation_div").removeClass('shadowed');
});

$('#collapse6').on('show.bs.collapse', function() {
  $("#rules_icon").empty().append('&#8689;');
  $("#rules_div").addClass('shadowed');
});

$('#collapse6').on('hide.bs.collapse', function() {
  $("#rules_icon").empty().append('&#8690;');
  $("#rules_div").removeClass('shadowed');
});

$(function() {
    $('#toggle_analisi').change(function() {
      $('#analisi_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_titolo').change(function() {
      $('#titolo_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_sinossi').change(function() {
      $('#sinossi_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_descrizione').change(function() {
      $('#descrizione_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_descrizione_semplificata').change(function() {
      $('#descrizione_semplificata_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_descrizione_ridotta').change(function() {
      $('#descrizione_ridotta_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_descrizione_residua').change(function() {
      $('#descrizione_residua_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_parafrasi').change(function() {
      $('#parafrasi_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_glossario').change(function() {
      $('#glossario_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_ruoli').change(function() {
      $('#ruoli_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_documenti').change(function() {
      $('#documenti_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_flussi').change(function() {
      $('#flussi_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_attivita').change(function() {
      $('#attivita_check').attr("value", $(this).prop('checked'))
  })
})

$(function() {
    $('#toggle_note').change(function() {
      $('#note_check').attr("value", $(this).prop('checked'))
  })
})
