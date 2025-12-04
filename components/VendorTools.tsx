import React, { useState } from 'react';
import { Camera, Sparkles, Upload, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { analyzeProductImage, generateMarketingCaption } from '../services/geminiService';

export const VendorTools: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setAnalysisResult(null);
        setGeneratedCaption('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!previewUrl) return;

    setIsAnalyzing(true);
    try {
      // 1. Analyze Image (Vision)
      // Extract base64 without prefix
      const base64Data = previewUrl.split(',')[1];
      const jsonString = await analyzeProductImage(base64Data);
      
      let data;
      try {
        // Clean markdown code blocks if present
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        data = JSON.parse(cleanJson);
      } catch (e) {
        data = { description: jsonString, category: 'Geral', estimatedPrice: 0 };
      }
      setAnalysisResult(data);

      // 2. Generate Marketing Caption (Text)
      const caption = await generateMarketingCaption(data.description || "produto incrível");
      setGeneratedCaption(caption);

    } catch (error) {
      console.error("Error processing vendor tool:", error);
      alert("Erro ao processar imagem. Verifique a chave da API ou tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="text-orange-500" />
          Estúdio de Criação IA
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Use a IA (nano banana / spark) para cadastrar produtos automaticamente e criar anúncios.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Upload */}
        <div className="space-y-4">
          <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${previewUrl ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}>
            {previewUrl ? (
              <div className="relative w-full h-64">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                <button 
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                >
                  <Upload size={16} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                  <Camera size={32} />
                </div>
                <span className="font-medium text-gray-900">Clique para enviar foto</span>
                <span className="text-sm text-gray-500 mt-1">ou arraste e solte aqui</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <Button 
            onClick={processImage} 
            disabled={!previewUrl || isAnalyzing} 
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <><Loader2 className="animate-spin mr-2" /> Analisando com Gemini...</>
            ) : (
              <><Sparkles className="mr-2" /> Analisar e Criar Anúncio</>
            )}
          </Button>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {analysisResult ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Auto-detected Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Dados Detectados (Vision)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Produto:</span>
                    <span className="font-medium">{analysisResult.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Categoria:</span>
                    <span className="font-medium">{analysisResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Preço Sugerido:</span>
                    <span className="font-medium text-green-600">R$ {analysisResult.estimatedPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Generated Caption */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <ImageIcon size={16} />
                  Legenda para Marketing (Copywriting)
                </h3>
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{generatedCaption}"
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedCaption)}>
                    Copiar
                  </Button>
                  <Button size="sm" variant="secondary">
                    Publicar Agora
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 border border-dashed border-gray-200 rounded-xl">
              <Sparkles size={48} className="mb-4 text-gray-200" />
              <p>Envie uma foto do produto para ver a mágica da IA acontecendo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};