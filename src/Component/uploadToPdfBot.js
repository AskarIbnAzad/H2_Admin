// Add this function to handle the new API upload
const uploadToPdfBot = async (fileToUpload) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", fileToUpload);
  
    try {
      // Using fetch API to make the request to the PDF Bot service
      const response = await fetch("http://192.158.232.113:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (data.success) {
        // Process response and notify parent component
        onPdfBotData(data);
        return { success: true, message: "PDF analyzed successfully" };
      } else {
        throw new Error(data.message || "Failed to analyze PDF");
      }
    } catch (error) {
      console.error("PDF Bot upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Modify the handleModalResponse function to use the new upload method
  const handleModalResponse = async (isPaywall) => {
    setShowModal(false);
    if (!pendingFile) return;
  
    try {
      setIsProcessingFile(true);
      
      // First, upload to PDF Bot for analysis
      const pdfBotResult = await uploadToPdfBot(pendingFile);
      
      if (pdfBotResult.success) {
        // Then, upload to Cloudinary for storage (if needed)
        const uploadResult = await uploadToCloudinary(pendingFile);
  
        const newPdf = {
          name: uploadResult.url,
          status: "Unverified",
          isPaywall: isPaywall
        };
  
        setFormData(prev => ({
          ...prev,
          pdf_url: [...(prev.pdf_url || []), newPdf]
        }));
        
        // Success notification
        success_toast_message("PDF analyzed and uploaded successfully");
      }
    } catch (error) {
      setErrorPdf("PDF analysis failed: " + error.message);
      error_toast_message("Failed to analyze PDF");
    } finally {
      setFileQueue(prev => prev.slice(1));
      setPendingFile(null);
      setIsProcessingFile(false);
    }
  };