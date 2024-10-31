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
    palavras = palavras.sort(() => 0.5 - Math.random());

    $("#zonaDeSoltar").empty();

    palavras.forEach(function (palavra, index) {
      var span = $("<span>")
        .addClass("palavra")
        .text(palavra)
        .attr("data-index", index);
      $("#zonaDeSoltar").append(span);
    });

    $("#zonaDeSoltar")
      .sortable({
        update: function () {
          registrarMovimento();
        },
      })
      .disableSelection();
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
      "Tempo: " +
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
    $("#contadorMovimentos").text("Movimentos: " + movimentos);
  }

   // Função de feedback visual para posição correta e incorreta


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
            "Correto! Você formou a frase corretamente.",
            "alerta-sucesso",
            true
        );
        $("#audio-acerto")[0].play(); 
    } else {
        mostrarFeedback("Incorreto! Tente novamente.", "alerta-erro", false);
        $("#audio-errado")[0].play();
       
    }
    verificarPosicaoPalavras(); 
    function verificarPosicaoPalavras() {
        var fraseOriginal = frases[indiceFraseAtual].split(" ");
        $("#zonaDeSoltar .palavra").each(function (index) {
            if ($(this).text() === fraseOriginal[index]) {
                $(this).addClass("certo").removeClass("errado");
            } else {
                $(this).addClass("errado").removeClass("certo");
            }
        });
    }// Chama a função para aplicar as classes .certo e .errado
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
      "Parabéns! Você completou todas as frases com " + estrelas + " estrelas!"
    );
  }

  function proximaFrase() {
    indiceFraseAtual++;
    if (indiceFraseAtual < frases.length) {
      iniciarJogo();
      $("#proximaFrase").hide();
    } else {
      finalizarJogo();
    }
  }

  $(document).ready(function () {
    $("#modalInicio").modal("show");
    $("#btnComecar").click(function () {
      iniciarJogo();
    });

    $("#verificar").click(function () {
      verificarFrase();
    });

    $("#proximaFrase").click(function () {
      proximaFrase();
    });
  });
})(jQuery);