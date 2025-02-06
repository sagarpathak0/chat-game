import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

type Offer = {
    offererUserName: string;
    offer: RTCSessionDescriptionInit;
    offerIceCandidates: RTCIceCandidateInit[];
    answererUserName: string | null;
    answer: RTCSessionDescriptionInit | null;
    answererIceCandidates: RTCIceCandidateInit[];
};

const CallComponent: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isRoomCreated, setIsRoomCreated] = useState<boolean>(false);
    const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Connect to the signaling server
        socketRef.current = io('http://localhost:5000', {
            auth: {
                userName: 'user1',
                password: 'x'
            }
        });
        
        socketRef.current.on('connect', () => {
            console.log('Connected to server!');
        });
        
        socketRef.current.on('connect_error', (err) => {
            console.error('Connection Error:', err.message);
        });

        socketRef.current.on('roomCreated', (roomName) => {
            setIsRoomCreated(true);
            setJoinedRoom(roomName);
        });

        socketRef.current.on('roomExists', (roomName) => {
            alert(`Room '${roomName}' already exists.`);
        });

        socketRef.current.on('roomNotFound', (roomName) => {
            alert(`Room '${roomName}' does not exist.`);
        });

        socketRef.current.on('roomJoined', (roomName) => {
            setJoinedRoom(roomName);
        });

        socketRef.current.on('newOfferAwaiting', (offers: Offer[]) => {
            setOffers(offers);
        });

        // Get local media (audio and video)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            })
            .catch(console.error);

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const createRoom = () => {
        if (roomName) {
            socketRef.current?.emit('createRoom', roomName);
        }
    };

    const joinRoom = () => {
        if (roomName) {
            socketRef.current?.emit('joinRoom', roomName);
        }
    };

    // const initializePeerConnection = () => {
    //     peerConnectionRef.current = new RTCPeerConnection(config);

    //     peerConnectionRef.current.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    //         if (event.candidate) {
    //             socketRef.current?.emit('sendIceCandidateToSignalingServer', {
    //                 didIOffer: true,
    //                 iceUserName: 'user1',
    //                 iceCandidate: event.candidate,
    //                 roomName: joinedRoom
    //             });
    //         }
    //     };

    //     peerConnectionRef.current.ontrack = (event: RTCTrackEvent) => {
    //         if (remoteVideoRef.current) {
    //             remoteVideoRef.current.srcObject = event.streams[0];
    //         }
    //     };

    //     if (localStreamRef.current) {
    //         localStreamRef.current.getTracks().forEach(track => {
    //             if (localStreamRef.current) {
    //                 peerConnectionRef.current?.addTrack(track, localStreamRef.current);
    //             }
    //         });
    //     }
    // };

    const answerOffer = (offer: Offer) => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer.offer))
                .then(() => {
                    return peerConnectionRef.current?.createAnswer();
                })
                .then((answer) => {
                    return peerConnectionRef.current?.setLocalDescription(answer);
                })
                .then(() => {
                    socketRef.current?.emit('newAnswer', { offererUserName: offer.offererUserName, answer: peerConnectionRef.current?.localDescription, roomName: joinedRoom });
                })
                .catch(console.error);
        }
    };

    return (
        <div>
            <h1>WebRTC Video Chat</h1>
            <div>
                <input 
                    type="text" 
                    value={roomName} 
                    onChange={(e) => setRoomName(e.target.value)} 
                    placeholder="Enter Room Name"
                />
                <button onClick={createRoom}>Create Room</button>
                <button onClick={joinRoom}>Join Room</button>
            </div>

            {isRoomCreated && <p>Room {roomName} created successfully!</p>}
            {joinedRoom && <p>Joined Room: {joinedRoom}</p>}

            <div>
                <h2>Local Video</h2>
                <video ref={localVideoRef} autoPlay playsInline muted />
            </div>

            <div>
                <h2>Remote Video</h2>
                <video ref={remoteVideoRef} autoPlay playsInline />
            </div>

            <div>
                <h2>Available Offers</h2>
                {offers.map((offer, index) => (
                    <div key={index}>
                        <button onClick={() => answerOffer(offer)}>Answer {offer.offererUserName}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CallComponent;
