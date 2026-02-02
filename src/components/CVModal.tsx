import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import cvFile from '../assets/cv.pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CVModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CVModal = ({ isOpen, onClose }: CVModalProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Responsive scaling
    useEffect(() => {
        if (!isOpen) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-card w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur">
                            <h3 className="text-xl font-bold text-foreground">CV-Brian Njuguna</h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={cvFile}
                                    download="Brian_Njuguna_CV.pdf"
                                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                                <a
                                    href={cvFile}
                                    download="Brian_Njuguna_CV.pdf"
                                    className="sm:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                    aria-label="Download CV"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                    aria-label="Close CV modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div
                            className="flex-1 overflow-y-auto bg-neutral-900/50 p-4 flex justify-center"
                            ref={containerRef}
                        >
                            <Document
                                file={cvFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex flex-col gap-4 max-w-full"
                                loading={
                                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
                                        Loading CV...
                                    </div>
                                }
                                error={
                                    <div className="text-destructive text-center p-4">
                                        Failed to load PDF. Please try downloading it instead.
                                    </div>
                                }
                            >
                                {Array.from(new Array(numPages), (_el, index) => (
                                    <div key={`page_${index + 1}`} className="shadow-2xl">
                                        <Page
                                            pageNumber={index + 1}
                                            width={containerWidth ? Math.min(containerWidth, 800) : undefined}
                                            className="rounded-lg overflow-hidden"
                                            renderAnnotationLayer={true}
                                            renderTextLayer={true}
                                        />
                                    </div>
                                ))}
                            </Document>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CVModal;
