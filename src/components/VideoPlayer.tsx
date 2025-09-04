import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';

interface VideoPlayerProps {
  videoUrl?: string;
  videoFile?: string;
  videoType?: 'youtube' | 'vimeo' | 'direct' | 'upload';
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoFile,
  videoType = 'direct',
  width = '100%',
  height = 'auto',
  autoPlay = false,
  controls = true,
  muted = false,
  poster,
  className,
  style
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get the actual video source
  const getVideoSource = () => {
    if (videoFile) return videoFile;
    if (videoUrl) return videoUrl;
    return null;
  };

  const videoSource = getVideoSource();

  // Handle video loading
  useEffect(() => {
    if (videoSource) {
      setIsLoading(true);
      setError(null);
    }
  }, [videoSource]);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle video events
  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load video');
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Render YouTube embed
  const renderYouTubeEmbed = (url: string) => {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) return null;

    return (
      <Box
        sx={{
          position: 'relative',
          width,
          height: height === 'auto' ? '315px' : height,
          '& iframe': {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 1
          }
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
    );
  };

  // Render Vimeo embed
  const renderVimeoEmbed = (url: string) => {
    const videoId = extractVimeoVideoId(url);
    if (!videoId) return null;

    return (
      <Box
        sx={{
          position: 'relative',
          width,
          height: height === 'auto' ? '315px' : height,
          '& iframe': {
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 1
          }
        }}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}&muted=${muted ? 1 : 0}&controls=${controls ? 1 : 0}`}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </Box>
    );
  };

  // Extract video IDs
  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const extractVimeoVideoId = (url: string): string | null => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // No video source
  if (!videoSource) {
    return (
      <Box
        sx={{
          width,
          height: height === 'auto' ? '200px' : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          border: '2px dashed #ccc'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No video available
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ width, height: height === 'auto' ? '200px' : height }}>
        {error}
      </Alert>
    );
  }

  // YouTube embed
  if (videoType === 'youtube' || (videoUrl && videoUrl.includes('youtube'))) {
    return renderYouTubeEmbed(videoUrl!);
  }

  // Vimeo embed
  if (videoType === 'vimeo' || (videoUrl && videoUrl.includes('vimeo'))) {
    return renderVimeoEmbed(videoUrl!);
  }

  // Direct video or uploaded file
  return (
    <Paper
      ref={containerRef}
      elevation={2}
      sx={{
        position: 'relative',
        width,
        height: height === 'auto' ? 'auto' : height,
        overflow: 'hidden',
        borderRadius: 1,
        ...style
      }}
      className={className}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <video
        ref={videoRef}
        src={videoSource}
        poster={poster}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        onLoadedData={handleLoadedData}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        autoPlay={autoPlay}
        muted={isMuted}
        controls={controls}
        preload="metadata"
      />

      {/* Custom controls overlay (when controls=false) */}
      {!controls && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            opacity: isPlaying ? 0 : 1,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <IconButton
            onClick={togglePlay}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
            size="large"
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
      )}

      {/* Control buttons */}
      {!controls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            gap: 1,
            opacity: isPlaying ? 0 : 1,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <IconButton
            onClick={toggleMute}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          <IconButton
            onClick={toggleFullscreen}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default VideoPlayer;
