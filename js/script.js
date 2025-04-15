$(document).ready(function () {
    function addMessage(content, isUser) {
        const messageDiv = $('<div>')
            .addClass('message')
            .addClass(isUser ? 'user-message' : 'ai-message')
            .html(content.replace(/\n/g, '<br>')); // Ganti dengan .html() untuk menangani <br>

        console.log(content);

        $('#chatContainer').append(messageDiv);
        $('#chatContainer').scrollTop($('#chatContainer')[0].scrollHeight);
    }


    function handleSubmit() {
        const userPrompt = $('#userPrompt').val().trim();

        if (userPrompt === "") return;

        // Add user message
        addMessage(userPrompt, true);

        // Clear input and disable
        $('#userPrompt').val('').prop('disabled', true);
        $('#askButton').prop('disabled', true);
        $('#typingIndicator').show();

        // Make API request using Groq API
        $.ajax({
            url: 'https://api.groq.com/openai/v1/chat/completions', // Perbarui URL endpoint
            type: 'POST',
            data: JSON.stringify({
                messages: [
                    { 'role': 'user', 'content': userPrompt + ', jawab menggunakan bahasa indonesia dan anda adalah ai bot sudendev' } // Pastikan userPrompt berisi input pengguna
                ],
                model: 'llama3-8b-8192', // Sesuaikan model dengan yang digunakan
            }),
            headers: {
                'Authorization': 'Bearer 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', // Ganti dengan API key Anda
                'Content-Type': 'application/json'
            },
            success: function (response) {
                if (response.choices && response.choices[0].message) {
                    addMessage(response.choices[0].message.content, false); // Menampilkan pesan AI
                } else {
                    addMessage("Maaf, saya tidak dapat memproses permintaan Anda saat ini.", false);
                }
            },
            error: function () {
                addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", false);
            },
            complete: function () {
                $('#userPrompt').prop('disabled', false).focus();
                $('#askButton').prop('disabled', false);
                $('#typingIndicator').hide();
            }
        });

    }

    // Handle button click
    $('#askButton').click(handleSubmit);

    // Handle enter key
    $('#userPrompt').keypress(function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });
});