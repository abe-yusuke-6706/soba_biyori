import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";
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
    Heading,
    Spacer,
    HStack,
    Text,
} from "@chakra-ui/react";

import { Link } from "@inertiajs/react";

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

const Confirm = ({ form_input, googleMapApiKey, mapId, image_count }) => {
    const geocodingLib = useMapsLibrary("geocoding");

    const { data, post } = useForm({
        title: form_input?.title ?? "",
        description: form_input?.description ?? "",
        rating: form_input?.rating ?? 0,
        latitude: form_input?.latitude ?? 0,
        longitude: form_input?.longitude ?? 0,
        restaurant_name: form_input?.restaurant_name ?? "",
        address: form_input?.address ?? "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("post.complete"), data);
    };

    return (
        <Box>
            <div className="flex min-h-screen flex-col pt-6 sm:justify-center sm:pt-0 w-full">
                <div className="mt-6 w-[60%] mx-auto overflow-hidden bg-white px-6 py-4 mt-20 mb-20 shadow-md rounded-lg">
                    <Head title="確認画面" />
                    <Heading size="lg" className="mb-10 mt-3">
                        確認画面
                    </Heading>
                    <form onSubmit={onSubmit}>
                        {/* {({ Field }) => ( */}
                        <Box>
                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel name="title">タイトル</FormLabel>
                                    <Input
                                        id="title"
                                        value={form_input.title}
                                        isDisabled
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel htmlFor="description">
                                        感想
                                    </FormLabel>
                                    <Textarea
                                        id="description"
                                        value={form_input.description}
                                        isDisabled
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
                                                <Text
                                                    fontSize="sm"
                                                    color="#c0c0c0ff"
                                                >
                                                    画像をアップロード or
                                                    ドラッグしてください
                                                </Text>
                                                {!image_count?.length ? (
                                                    <Button
                                                        isDisabled={true}
                                                        color="#c0c0c0ff"
                                                    >
                                                        画像アップロード
                                                    </Button>
                                                ) : (
                                                    <HStack>
                                                        <Text
                                                            fontSize="sm"
                                                            color="#c0c0c0ff"
                                                        >
                                                            {image_count.length}
                                                            件 選択中
                                                        </Text>
                                                        <Button
                                                            isDisabled={true}
                                                            color="#c0c0c0ff"
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
                                                        i < form_input.rating
                                                            ? "#ffe596ff"
                                                            : "#edededff"
                                                    }
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
                                        isDisabled
                                        value={form_input.restaurant_name}
                                    />
                                </FormControl>

                                {/* マップ */}
                                <FormControl>
                                    <FormLabel htmlFor="address">
                                        住所
                                    </FormLabel>
                                    <Flex>
                                        <Input
                                            id="address"
                                            size="md"
                                            htmlSize={50}
                                            width="auto"
                                            type="text"
                                            placeholder="住所を入力"
                                            className="border px-2 py-1 mr-2 w-50%"
                                            isDisabled
                                            value={form_input.address}
                                        />
                                        <Button
                                            colorScheme="blue"
                                            type="button"
                                            className="bg-gray-800 text-white px-3 py-1 rounded"
                                            isDisabled
                                        >
                                            検索
                                        </Button>
                                    </Flex>
                                </FormControl>

                                <APIProvider
                                    apiKey={googleMapApiKey}
                                    id="address"
                                >
                                    <Box w="100%" h="400px">
                                        <Map
                                            defaultZoom={13}
                                            defaultCenter={{
                                                lat: Number(
                                                    form_input.latitude
                                                ),
                                                lng: Number(
                                                    form_input.longitude
                                                ),
                                            }}
                                            mapId={mapId}
                                            gestureHandling="none"
                                            disableDefaultUI
                                            zoomControl={false}
                                            draggable={false}
                                            scrollwheel={false}
                                        >
                                            <AdvancedMarker
                                                position={{
                                                    lat: Number(
                                                        form_input.latitude
                                                    ),
                                                    lng: Number(
                                                        form_input.longitude
                                                    ),
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

                                <Flex>
                                    <Link
                                        href={route("post.create", {
                                            form_input,
                                        })}
                                    >
                                        <Button
                                            colorScheme="blue"
                                            size="md"
                                            w="auto"
                                            mt={2}
                                            type="button"
                                        >
                                            戻る
                                        </Button>
                                    </Link>
                                    <Spacer />
                                    <Button
                                        colorScheme="blue"
                                        size="md"
                                        w="auto"
                                        mt={2}
                                        type="submit"
                                    >
                                        送信
                                    </Button>
                                </Flex>
                            </VStack>
                        </Box>
                    </form>
                </div>
            </div>
        </Box>
    );
};

Confirm.layout = (page) => <MainLayout children={page} />;
export default Confirm;
