import { AudioFile } from "@/types/audio";
import axios from "axios";

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

			const audioFile: AudioFile = {
				uri: audioUri,
				type: mimeType,
				name: `audio.${fileExtension}`,
			};

			formData.append("file", audioFile as unknown as Blob);
			formData.append("model", "whisper-1");

			const result = await axios.post(
				process.env.EXPO_PUBLIC_OPENAI_TRANSCRIPTION_URL!,
				formData,
				{
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			return result.data.text;
		} catch (error) {
			console.error("Speech to text error:", error);
		}
	};

	const getChatResponse = async (userMessage: string) => {
		try {
			const response = await axios.post(
				process.env.EXPO_PUBLIC_OPENAI_CHAT_URL!,
				{
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
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
				}
			);

			return response.data.choices[0].message.content;
		} catch (error) {
			console.error("Chat error:", error);
		}
	};

	const textToSpeech = async (text: string) => {
		try {
			const voiceId = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID!;

			const response = await axios.post(
				`${process.env.EXPO_PUBLIC_TEXT_TO_SPEACH_URL!}/${voiceId}`,
				{
					text: text,
					model_id: "eleven_monolingual_v1",
					voice_settings: {
						stability: 0.5,
						similarity_boost: 0.5,
						speed: 1.04,
					},
				},
				{
					headers: {
						Accept: "audio/mpeg",
						"Content-Type": "application/json",
						"xi-api-key": process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY!,
					},
					responseType: "arraybuffer",
				}
			);

			const base64Audio = btoa(
				new Uint8Array(response.data).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					""
				)
			);

			return base64Audio;
		} catch (error) {
			console.error("Text to speech error:", error);
		}
	};

	return {
		speechToText,
		getChatResponse,
		textToSpeech,
	};
};
