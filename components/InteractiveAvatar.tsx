import type { StartAvatarResponse } from "@heygen/streaming-avatar";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, TaskMode, TaskType, VoiceEmotion,
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Tabs,
  Tab,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";
import { MessageSquareText, Mic, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

export default function InteractiveAvatar() {
  const router = useRouter();
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');

  const [data, setData] = useState<StartAvatarResponse>();
  const [text, setText] = useState<string>("");
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [chatMode, setChatMode] = useState("text_mode");
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  useEffect(() => {
    const selectedAvatarId = localStorage.getItem('selectedAvatarId');
    if (selectedAvatarId) {
      setAvatarId(selectedAvatarId);
      localStorage.removeItem('selectedAvatarId');
    }
  }, []);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  async function startSession() {
    setIsLoadingSession(true);
    setLoadingMessage("Initializing your avatar session... This may take a few seconds.");

    const newToken = await fetchAccessToken();
    if (!newToken) {
      setLoadingMessage("Having trouble connecting. Please try again.");
      setIsLoadingSession(false);
      return;
    }

    setLoadingMessage("Almost ready! Setting up your interactive experience...");

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log(">>>>> Stream ready:", event.detail);
      setStream(event.detail);
      setLoadingMessage("");
    });
    avatar.current?.on(StreamingEvents.USER_START, (event) => {
      console.log(">>>>> User started talking:", event);
      setIsUserTalking(true);
    });
    avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
      console.log(">>>>> User stopped talking:", event);
      setIsUserTalking(false);
    });
    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        knowledgeBase: knowledgeBase,
        // knowledgeBase: "https://www.appclick.ng/about.php", // Or use a custom `knowledgeBase`.
        // knowledgeId: knowledgeId, // Or use a custom `knowledgeBase`.
        voice: {
          // voice_id: "26b2064088674c80b1e5fc5ab1a068eb",
          rate: 1.5, // 0.5 ~ 1.5
          emotion: VoiceEmotion.EXCITED,
          // elevenlabsSettings: {
          //   stability: 1,
          //   similarity_boost: 1,
          //   style: 1,
          //   use_speaker_boost: false,
          // },
        },
        video_encoding: {
          codec: "h264", // Video codec (h264 or vp8)
        },
        language: language,
        disableIdleTimeout: true,
      } as any);

      setData(res);
      // default to voice mode
      await avatar.current?.startVoiceChat({
        useSilencePrompt: false
      });
      setChatMode("voice_mode");
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setLoadingMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoadingSession(false);
      setLoadingMessage("");
    }
  }
  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    // speak({ text: text, task_type: TaskType.REPEAT })
    await avatar.current.speak({ text: text, taskType: TaskType.TALK, taskMode: TaskMode.SYNC }).catch((e) => {
      setDebug(e.message);
    });
    setIsLoadingRepeat(false);
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt()
      .catch((e) => {
        setDebug(e.message);
      });
  }
  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  const handleChangeChatMode = useMemoizedFn(async (v) => {
    if (v === chatMode) {
      return;
    }
    if (v === "text_mode") {
      avatar.current?.closeVoiceChat();
    } else {
      await avatar.current?.startVoiceChat();
    }
    setChatMode(v);
  });

  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening();
    } else if (previousText && !text) {
      avatar?.current?.stopListening();
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardBody className="h-[400px] flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-[400px] w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <track kind="captions" />
              </video>
              <div className="flex flex-col gap-2 absolute bottom-3 right-3">
                <Button
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                  size="md"
                  variant="shadow"
                  onClick={handleInterrupt}
                >
                  Interrupt task
                </Button>
                <Button
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                  size="md"
                  variant="shadow"
                  onClick={endSession}
                >
                  End session
                </Button>
              </div>
            </div>
          ) : !isLoadingSession ? (
            <div className="h-full justify-center items-center flex flex-col gap-8 w-[500px] self-center relative">
              <Button
                isIconOnly
                className="absolute -left-40 top-0 bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="text-black" size={24} />
              </Button>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-sm font-medium leading-none">
                  Knowledge Base
                </p>
                <Input
                  placeholder="Enter your knowledge base content or URL"
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500 mb-4">
                  Enter either a URL or text content that will serve as the avatar's knowledge base
                </p>
                <div style={{ display: 'none' }}>
                  <p className="text-sm font-medium leading-none">
                    {/* Custom Avatar ID (optional) */}
                    Selected Avatar
                  </p>
                  <Input
                    placeholder="Enter a custom avatar ID"
                    value={avatarId}
                    onChange={(e) => setAvatarId(e.target.value)}
                    isReadOnly
                  />
                </div>
                {/* <Select
                  placeholder="Or select one from these example avatars"
                  size="md"
                  onChange={(e) => {
                    setAvatarId(e.target.value);
                  }}
                  selectedKeys={avatarId ? [avatarId] : []}
                >
                  {AVATARS.map((avatar) => (
                    <SelectItem
                      key={avatar.avatar_id}
                      textValue={avatar.avatar_id}
                    >
                      {avatar.name}
                    </SelectItem>
                  ))}
                </Select> */}
                <Select
                  label="Select language"
                  placeholder="Select language"
                  className="max-w-xs"
                  selectedKeys={[language]}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                >
                  {STT_LANGUAGE_LIST.map((lang) => (
                    <SelectItem 
                      key={lang.key}
                      startContent={
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100">
                          <span className="text-lg">{lang.flag}</span>
                        </div>
                      }
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
                size="md"
                variant="shadow"
                onClick={startSession}
                isDisabled={!knowledgeBase.trim()}
              >
                Start session
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Spinner color="default" size="lg" />
              {loadingMessage && (
                <div className="text-center max-w-md">
                  <p className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-indigo-300 font-medium animate-pulse">
                    {loadingMessage}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    This process usually takes 10-15 seconds
                  </p>
                </div>
              )}
            </div>
          )}
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-3 relative">
          <Tabs
            aria-label="Chat mode options"
            selectedKey={chatMode}
            onSelectionChange={(v) => {
              handleChangeChatMode(v);
            }}
            classNames={{
              tabList: "gap-4",
              cursor: "w-full bg-gradient-to-tr from-indigo-500 to-indigo-300",
              tab: "h-10 w-10 data-[selected=true]:text-white",
            }}
          >
            <Tab
              key="text_mode"
              title={
                <Tooltip content="Chat" delay={0}>
                  <MessageSquareText
                    size={24}
                    className={`${chatMode === "text_mode"
                        ? "text-white"
                        : "text-indigo-500"
                      } transition-colors`}
                  />
                </Tooltip>
              }
              aria-label="Text mode"
            />
            <Tab
              key="voice_mode"
              title={
                <Tooltip content="Voice" delay={0}>
                  <Mic
                    size={24}
                    className={`${chatMode === "voice_mode"
                        ? "text-white"
                        : "text-indigo-500"
                      } transition-colors`}
                  />
                </Tooltip>
              }
              aria-label="Voice mode"
            />
          </Tabs>
          {chatMode === "text_mode" ? (
            <div className="w-full flex relative">
              <InteractiveAvatarTextInput
                disabled={!stream}
                input={text}
                label=""
                loading={isLoadingRepeat}
                placeholder="Type something for the avatar to respond"
                setInput={setText}
                onSubmit={handleSpeak}
              />
              {text && (
                <Chip className="absolute right-16 top-3">Listening</Chip>
              )}
            </div>
          ) : (
            <div className="w-full text-center">
              <Button
                isDisabled={!isUserTalking}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                size="md"
                variant="shadow"
              >
                {isUserTalking ? "Listening" : "Voice chat"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      {/* <p className="font-mono text-right">
        <span className="font-bold">Console:</span>
        <br />
        {debug}
      </p> */}
    </div>
  );
}
