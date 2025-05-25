


fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer <TOKEN>',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1-zero:free',
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    }),
  }).then((res) => res.json())
  .then((data) => {
    console.log(data)
    console.log('💬 Response:', data.choices?.[0]?.message?.content);
  })
  .catch((err) => {
    console.error('❌ Error calling OpenRouter:', err.message);
  });
  
