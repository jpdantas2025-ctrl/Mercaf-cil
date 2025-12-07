
import React, { useState } from 'react';
import { Camera, Sparkles, Upload, Loader2, Image as ImageIcon, CheckCircle, Video, PlayCircle, Download, Share2 } from 'lucide-react';
import { Button } from './Button';
import { analyzeProductImage, generateMarketingCaption, generateMarketingVideo } from '../services/geminiService';

export const VendorTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  
  // Image State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');

  // Video State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

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
      // Extract MIME type and Base64 data correctly
      const [header, base64Data] = previewUrl.split(',');
      const mimeType = header.split(':')[1].split(';')[0];

      const jsonString = await analyzeProductImage(base64Data, mimeType);
      
      let data;
      try {
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

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsGeneratingVideo(true);
    try {
      const url = await generateMarketingVideo(videoPrompt);
      setGeneratedVideoUrl(url);
    } catch (error) {
      alert("Erro ao gerar vídeo. Tente novamente.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="text-orange-500" />
          Estúdio de Criação IA
        </h2>
        <div className="flex gap-4 mt-4">
            <button 
                onClick={() => setActiveTab('image')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'image' ? 'text-orange-600 border-orange-600' : 'text-gray-500 border-transparent'}`}
            >
                Foto & Anúncio
            </button>
            <button 
                onClick={() => setActiveTab('video')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'video' ? 'text-orange-600 border-orange-600' : 'text-gray-500 border-transparent'}`}
            >
                Vídeo Comercial (Veo)
            </button>
        </div>
      </div>

      {activeTab === 'image' && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
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
      )}

      {activeTab === 'video' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
              <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-purple-900 text-sm mb-4">
                      <p className="font-bold flex items-center gap-2"><Video size={16}/> Gerador de Vídeo Veo</p>
                      <p>Crie vídeos curtos (6s) para Stories do Instagram ou TikTok descrevendo seu produto.</p>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descreva o vídeo</label>
                      <textarea 
                        className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Ex: Close cinematográfico em uma cesta de frutas tropicais com luz do sol, gotas de água, 4k."
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                      />
                  </div>

                  <Button 
                    onClick={handleGenerateVideo} 
                    disabled={!videoPrompt || isGeneratingVideo} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                  >
                    {isGeneratingVideo ? (
                        <><Loader2 className="animate-spin mr-2" /> Gerando com Veo (Isso leva ~1 min)...</>
                    ) : (
                        <><PlayCircle className="mr-2" /> Gerar Vídeo</>
                    )}
                  </Button>
              </div>

              <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 min-h-[300px] overflow-hidden">
                  {generatedVideoUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-900">
                          <video 
                            src={generatedVideoUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="max-h-[300px] w-full rounded-lg shadow-2xl border border-gray-700 mb-4 object-contain" 
                          />
                          <div className="flex gap-2 w-full justify-center">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                onClick={() => window.open(generatedVideoUrl, '_blank')}
                              >
                                <Download size={16} className="mr-2"/> Baixar MP4
                              </Button>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white border-none">
                                <Share2 size={16} className="mr-2"/> Compartilhar
                              </Button>
                          </div>
                      </div>
                  ) : (
                      <div className="text-center text-gray-400">
                          <Video size={48} className="mx-auto mb-2 opacity-20" />
                          <p>O vídeo gerado aparecerá aqui.</p>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
