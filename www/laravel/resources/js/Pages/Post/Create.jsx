import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import {
    Box,
    Input,
    Flex,
    Button,
    FormControl,
    FormLabel,
    VStack,
    Textarea,
    Text,
    HStack,
} from "@chakra-ui/react";

import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";

import {
    FileUpload,
    FileUploadTrigger,
    FileUploadDropzone,
} from "@saas-ui/file-upload";

const Create = ({ googleMapApiKey, mapId }) => {
    const [address, setAddress] = useState(null);
    const geocodingLib = useMapsLibrary("geocoding");
    const { form_input } = usePage().props;

    const [mapCenter, setMapCenter] = useState({
        lat: Number(form_input?.latitude ?? 35.6813),
        lng: Number(form_input?.longitude ?? 139.767066),
    });

    const { data, setData, post } = useForm({
        title: form_input?.title ?? "",
        description: form_input?.description ?? "",
        rating: form_input?.rating ?? 0,
        latitude: form_input?.latitude ?? 0,
        longitude: form_input?.longitude ?? 0,
        restaurant_name: form_input?.restaurant_name ?? "",
        address: form_input?.address ?? "",
        images: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(
            route("post.store"),
            {
                ...data,
                _method: "put",
            },
            {
                forceFormData: true,
            }
        );
    };

    // console.log(data);

    return (
        <div className="flex min-h-screen flex-col pt-6 sm:justify-center sm:pt-0 w-full">
            <div className="mt-6 w-[60%] mx-auto overflow-hidden bg-white px-6 py-4 mt-20 mb-20 shadow-md rounded-lg">
                <Head title="新規投稿" />
                <form onSubmit={onSubmit}>
                    <Box>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel name="title">タイトル</FormLabel>
                                <Input
                                    id="title"
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    value={data.title}
                                />
                            </FormControl>

                            <FormControl isRequired className="mb-3">
                                <FormLabel htmlFor="description">
                                    感想
                                </FormLabel>
                                <Textarea
                                    id="description"
                                    placeholder="感想を入力"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    value={data.description}
                                />
                            </FormControl>
                            {/* 写真アップロード */}
                            <FileUpload
                                maxFileSize={1024 * 1024}
                                maxFiles={10}
                                accept="image/*"
                                onFileChange={(files) => {
                                    setData("images", files);
                                    console.log(data.image);
                                }}
                            >
                                {({ acceptedFiles, clearFiles }) => {
                                    return (
                                        <FileUploadDropzone>
                                            <Text fontSize="sm">
                                                画像をアップロード or
                                                ドラッグしてください
                                            </Text>
                                            {!acceptedFiles?.length ? (
                                                <FileUploadTrigger as={Button}>
                                                    画像アップロード
                                                </FileUploadTrigger>
                                            ) : (
                                                <HStack>
                                                    <Text fontSize="sm">
                                                        {acceptedFiles.length}
                                                        選択中
                                                    </Text>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearFiles();
                                                            setData(
                                                                "images",
                                                                []
                                                            );
                                                        }}
                                                    >
                                                        キャンセル
                                                    </Button>
                                                </HStack>
                                            )}
                                        </FileUploadDropzone>
                                    );
                                }}
                            </FileUpload>

                            {/* 五段階評価 */}
                            <FormControl className="mb-6">
                                <FormLabel htmlFor="score">評価</FormLabel>
                                <Box id="score">
                                    {Array(5)
                                        .fill("")
                                        .map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                w={6}
                                                h={6}
                                                color={
                                                    i < data.rating
                                                        ? "#ffc107"
                                                        : "#c4c4c4ff"
                                                }
                                                onClick={() =>
                                                    setData({
                                                        ...data,
                                                        rating: i + 1,
                                                    })
                                                }
                                                cursor={"pointer"}
                                            />
                                        ))}
                                </Box>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="restaurant_name">
                                    店舗名
                                </FormLabel>
                                <Input
                                    id="restaurant_name"
                                    placeholder="店舗名を入力"
                                    onChange={(e) =>
                                        setData(
                                            "restaurant_name",
                                            e.target.value
                                        )
                                    }
                                    value={data.restaurant_name}
                                />
                            </FormControl>

                            {/* マップ */}
                            <FormControl>
                                <FormLabel htmlFor="address">住所</FormLabel>
                                <Flex>
                                    <Input
                                        id="address"
                                        size="md"
                                        htmlSize={50}
                                        width="auto"
                                        type="text"
                                        placeholder="住所を入力"
                                        className="border px-2 py-1 mr-2 w-50%"
                                        onChange={(e) => {
                                            setData("address", e.target.value);
                                            setAddress(e.target.value);
                                        }}
                                        value={data.address}
                                    />
                                    <Button
                                        colorScheme="blue"
                                        type="button"
                                        className="bg-gray-800 text-white px-3 py-1 rounded"
                                        onClick={async (e) => {
                                            const geocoder =
                                                new google.maps.Geocoder();
                                            geocoder.geocode(
                                                { address },
                                                async (results, status) => {
                                                    if (results) {
                                                        const lat =
                                                            results[0].geometry.location.lat();

                                                        const lng =
                                                            results[0].geometry.location.lng();

                                                        setMapCenter({
                                                            lat,
                                                            lng,
                                                        });

                                                        setData(
                                                            "latitude",
                                                            lat
                                                        );
                                                        setData(
                                                            "longitude",
                                                            lng
                                                        );
                                                    }
                                                }
                                            );
                                        }}
                                    >
                                        検索
                                    </Button>
                                </Flex>
                            </FormControl>

                            <APIProvider apiKey={googleMapApiKey}>
                                <Box w="100%" h="400px">
                                    <Map
                                        defaultZoom={13}
                                        center={mapCenter}
                                        mapId={mapId}
                                        onClick={(e) => {
                                            setData(
                                                "latitude",
                                                e.detail.latLng.lat
                                            );
                                            setData(
                                                "longitude",
                                                e.detail.latLng.lng
                                            );
                                        }}
                                    >
                                        <AdvancedMarker
                                            position={{
                                                lat: Number(data.latitude),
                                                lng: Number(data.longitude),
                                            }}
                                            libraries={["geocoding"]}
                                        >
                                            <Pin
                                                background={"#FBBC04"}
                                                glyphColor={"#000"}
                                                borderColor={"#000"}
                                            />
                                        </AdvancedMarker>
                                    </Map>
                                </Box>
                            </APIProvider>

                            <Button
                                colorScheme="blue"
                                size="md"
                                w="auto"
                                mt={2}
                                type="submit"
                            >
                                確認する
                            </Button>
                        </VStack>
                    </Box>
                </form>
            </div>
        </div>
    );
};

Create.layout = (page) => <MainLayout children={page} />;
export default Create;
