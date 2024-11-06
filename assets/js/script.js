(function ($) {
  var indiceFraseAtual = 0;
  var movimentos = 0;
  var tempoInicial, intervalo;

  function iniciarJogo() {
    $("#zonaDeSoltar").empty();
    movimentos = 0;
    atualizarContadorMovimentos();
    iniciarTempo();
    embaralharFrase(frases[indiceFraseAtual]);
  }

  function embaralharFrase(frase) {
    var palavras = frase.split(" ");

    do {
      palavras = palavras.sort(() => 0.5 - Math.random());
    } while (palavras.join(" ") === frase);

    $("#zonaDeSoltar").empty();

    palavras.forEach(function (palavra, index) {
      var span = $("<span>")
        .addClass("palavra")
        .text(palavra)
        .attr("data-index", index);
      $("#zonaDeSoltar").append(span);
    });

    $("#zonaDeSoltar").sortable({
      start: function (event, ui) {
        ui.item.css("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.5)");
      },
      stop: function (event, ui) {
        ui.item.css("box-shadow", "none");
      },
      update: function () {
        registrarMovimento();
        verificarFrase();
      },
      tolerance: "pointer",
      cursor: "move"
    });
  }

  function iniciarTempo() {
    tempoInicial = new Date().getTime();
    intervalo = setInterval(atualizarTempo, 1000);
  }

  function atualizarTempo() {
    var agora = new Date().getTime();
    var diferenca = agora - tempoInicial;
    var minutos = Math.floor(diferenca / 60000);
    var segundos = Math.floor((diferenca % 60000) / 1000);
    $("#contadorTempo").text(
      " " +
      (minutos < 10 ? "0" : "") +
      minutos +
      ":" +
      (segundos < 10 ? "0" : "") +
      segundos
    );
  }

  function registrarMovimento() {
    movimentos++;
    atualizarContadorMovimentos();
  }

  function atualizarContadorMovimentos() {
    $("#contadorMovimentos").text(movimentos);
  }

  function verificarFrase() {
    var fraseOriginal = frases[indiceFraseAtual];
    var palavrasUsuario = $("#zonaDeSoltar .palavra")
      .map(function () {
        return $(this).text();
      })
      .get()
      .join(" ");

    if (palavrasUsuario === fraseOriginal) {
      mostrarFeedback(
        "Congratulations! You arranged the sentence correctly.",
        "alerta-sucesso",
        true
      );
      $("#audio-acerto")[0].play();
    } else {
      mostrarFeedback("Incorrect! Try again", "alerta-erro", false);
      $("#audio-errado")[0].play();

    }

    verificarPosicaoPalavras();
    function verificarPosicaoPalavras() {
      var fraseOriginal = frases[indiceFraseAtual].split(" ");

      $("#zonaDeSoltar .palavra").each(function (index) {
        var textoPalavra = $(this).text();
        var posicaoCorreta = fraseOriginal.indexOf(textoPalavra);

        if (index === posicaoCorreta) {
          $(this).addClass("certo").removeClass("errado quase");

        } else if (index === posicaoCorreta - 1 || index === posicaoCorreta + 1) {
          $(this).addClass("quase").removeClass("certo errado");
        } else {
          $(this).addClass("errado").removeClass("certo quase");
        }
      });
    }
  }

  function mostrarFeedback(mensagem, tipo, correto) {
    var alerta = $("<div>")
      .addClass("alerta " + tipo)
      .text(mensagem);
    $(".container").append(alerta);
    alerta.fadeIn();

    setTimeout(function () {
      alerta.fadeOut(function () {
        $(this).remove();
        if (correto) finalizarJogo();
      });
    }, 3000);
  }

  function calcularPontuacao() {
    clearInterval(intervalo);
    var tempoFinal = new Date().getTime();
    var tempoDecorrido = Math.floor((tempoFinal - tempoInicial) / 1000);
    var estrelas = 0;

    var limiteIdealMovimentos = 3;
    var limiteIdealTempo = 30;
    var limiteAceitavelMovimentos = 5;
    var limiteAceitavelTempo = 60;

    if (
      movimentos <= limiteIdealMovimentos &&
      tempoDecorrido <= limiteIdealTempo
    ) {
      estrelas = 3;
    } else if (
      (movimentos <= limiteIdealMovimentos &&
        tempoDecorrido <= limiteAceitavelTempo) ||
      (movimentos <= limiteAceitavelMovimentos &&
        tempoDecorrido <= limiteIdealTempo)
    ) {
      estrelas = 2;
    } else if (
      movimentos <= limiteAceitavelMovimentos &&
      tempoDecorrido <= limiteAceitavelTempo
    ) {
      estrelas = 1;
    }

    return estrelas;
  }
  function finalizarJogo() {
    var estrelas = calcularPontuacao();

    $("#proximaFrase").show();

    $("#modalFeedback").modal("show");
    $("#textoFeedbackFinal").text(
      "Parabéns! Você organizou a frase corretamente e ganhou " + estrelas + " estrela(s)!"
    );

    $("#modalFeedback .gif-modal").remove();

    var img = $('<img>');
    img.addClass('gif-modal img-fluid');
    switch (estrelas) {
      case 1:
        img.attr('src', 'assets/img/estrela.gif');
        break;
      case 2:
        img.attr('src', 'assets/img/estrela2.gif');
        break;
      case 3:
        img.attr('src', 'assets/img/estrela3.gif');
        break;
      default:

        break;
    }

    $("#modalFeedback .modal-body").prepend(img);
  }

  function proximaFrase() {
    if (indiceFraseAtual < frases.length - 1) {
      indiceFraseAtual++;
      iniciarJogo();
      $("#proximaFrase").hide();
    } else {
      mostrarAlertaFimDoJogo();
    }
  }

  function iniciarJogo() {
    $("#zonaDeSoltar").empty();
    movimentos = 0;
    atualizarContadorMovimentos();
    iniciarTempo();
    embaralharFrase(frases[indiceFraseAtual]);
  }

  function mostrarAlertaFimDoJogo() {
    var alertaFim = $("<div>")
      .addClass("alerta alerta-sucesso")
      .text("Finish");

    $("#proximaFrase").addClass("disabled");

    $(".container").append(alertaFim);
    alertaFim.fadeIn();
  }

  $(document).ready(function () {
    $("#modalInicio").modal("show");
    $("#btnComecar").click(function () {
      iniciarJogo();
    });

    $("#proximaFrase").click(function () {
      proximaFrase();
    });
  });
})(jQuery);
