
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ImageDisplay } from './components/ImageDisplay';
import { ErrorAlert } from './components/ErrorAlert';
import { generatePixelArt } from './services/geminiService';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async (newPrompt: string) => {
        setPrompt(newPrompt);
        if (!newPrompt) {
            setError("Please enter a prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const base64Image = await generatePixelArt(newPrompt);
            const dataUrl = `data:image/png;base64,${base64Image}`;
            setImageUrl(dataUrl);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header />
                <main className="mt-8">
                    <PromptForm onGenerate={handleGenerate} isLoading={isLoading} />
                    {error && <ErrorAlert message={error} />}
                    <ImageDisplay imageUrl={imageUrl} isLoading={isLoading} prompt={prompt} />
                </main>
            </div>
        </div>
    );
};

export default App;
