export const useVoiceAPI = () => {
	const speechToText = async (audioUri: string) => {
		try {
			const fileExtension = audioUri.split(".").pop()?.toLowerCase() || "m4a";

			const mimeTypes: Record<string, string> = {
				m4a: "audio/m4a",
				mp3: "audio/mpeg",
				wav: "audio/wav",
				mp4: "audio/mp4",
				webm: "audio/webm",
				ogg: "audio/ogg",
			};

			const mimeType = mimeTypes[fileExtension] || "audio/m4a";

			const formData = new FormData();
			formData.append("file", {
				uri: audioUri,
				type: mimeType,
				name: `audio.${fileExtension}`,
			} as any);
			formData.append("model", "whisper-1");

			const result = await fetch(
				"https://api.openai.com/v1/audio/transcriptions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
					},
					body: formData,
				}
			);

			const responseText = await result.text();

			if (!result.ok) {
				throw new Error(`API error: ${result.status} - ${responseText}`);
			}

			const data = JSON.parse(responseText);
			return data.text;
		} catch (error) {
			console.error("Speech to text error:", error);
			throw error;
		}
	};

	const getChatResponse = async (userMessage: string) => {
		try {
			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "gpt-4",
						messages: [
							{
								role: "system",
								content: "You are a helpful assistant.",
							},
							{
								role: "user",
								content: userMessage,
							},
						],
						temperature: 0.7,
					}),
				}
			);

			const responseText = await response.text();

			if (!response.ok) {
				throw new Error(`Chat API error: ${response.status} - ${responseText}`);
			}

			const data = JSON.parse(responseText);
			return data.choices[0].message.content;
		} catch (error) {
			console.error("Chat error:", error);
			throw error;
		}
	};

	const textToSpeech = async (text: string) => {
		try {
			const voiceId = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID!;

			const response = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
				{
					method: "POST",
					headers: {
						Accept: "audio/mpeg",
						"Content-Type": "application/json",
						"xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY!,
					},
					body: JSON.stringify({
						text: text,
						model_id: "eleven_monolingual_v1",
						voice_settings: {
							stability: 0.5,
							similarity_boost: 0.5,
						},
					}),
				}
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`TTS API error: ${response.status} - ${errorText}`);
			}

			const arrayBuffer = await response.arrayBuffer();
			const base64Audio = btoa(
				new Uint8Array(arrayBuffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					""
				)
			);

			return base64Audio;
		} catch (error) {
			console.error("Text to speech error:", error);
			throw error;
		}
	};

	return {
		speechToText,
		getChatResponse,
		textToSpeech,
	};
};
