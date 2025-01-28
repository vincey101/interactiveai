'use client';

import { Box, Grid } from "@mui/material";
import VideoContainer from "../videoContainer/VideoContainer";

const videos = [
    { title: 'Video #1 - Ink AI Overview', url: 'Hqpyue7JYhE' },
    { title: 'Video #2 - How To Configure Your API Key', url: 'CTktXxm3yeA' },
    { title: 'Video #3 - How To Design Your eCover', url: '9OLZ2KAH85E' },
    { title: 'Video #4 - Ink AI Done For You System', url: 'Y2WYAILdk2A' },
];

export default function Tutorial() {
    return (
        <div className="w-full max-w-[1400px] mx-auto font-sans">
            <div className="container mx-auto px-4">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
                        
                        </div>
                    </Grid>

                    <Grid item xs={12} md={2} className="hidden md:block" />
                    <Grid item xs={12} md={8}>
                        <div className="space-y-8">
                            <p className="text-red-600 font-semibold text-lg">
                                IMPORTANT: Pls Take Action - Ink AI Bonuses For All Members
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="https://warriorplus.com/o2/a/t9bcvq/0/tutorial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors"
                                >
                                    &gt;&gt; Click Here To Launch Your Own 6-Figures/Month "ChatGPT-Like" AI Chatbot
                                </a>
                                <a
                                    href="https://bit.ly/seyi-adeleke-channel"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-colors text-base"
                                >
                                    &gt;&gt; Subscribe To Our Youtube Channel
                                </a>
                            </div>

                            <div className="space-y-12">
                                {videos.map((video, index) => (
                                    <div key={index} className="space-y-4">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {video.title}
                                        </h2>
                                        <div className="aspect-video">
                                            <VideoContainer url={video.url} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}