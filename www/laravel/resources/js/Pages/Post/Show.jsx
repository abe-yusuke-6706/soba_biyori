import { useState } from "react";
import {
    Box,
    Image,
    Button,
    Text,
    Stack,
    Center,
    Flex,
    Card,
    CardBody,
    Heading,
    Input,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";

import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { useForm } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";
import { StarIcon } from "@chakra-ui/icons";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const Show = ({
    post,
    comments,
    isLiked,
    likes,
    images,
    mapId,
    googleMapApiKey,
}) => {
    const geocodingLib = useMapsLibrary("geocoding");
    const arrayComments = comments.slice();
    console.log(images);
    const {
        data,
        setData,
        delete: destroy,
        post: submit,
    } = useForm({
        comment: "",
        post_id: post.id,
    });

    console.log(images);

    const onSubmit = (e) => {
        e.preventDefault();
        submit(route("comment.store", post.id), data);
    };

    return (
        <Box>
            <Center>
                <Card overflow="hidden" w="65%" mt={10} mb={10}>
                    <CardBody>
                        {/* スライド画像 */}
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={() => console.log("slide change")}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {!images.length == 0 ? (
                                images.map((image) => (
                                    <SwiperSlide key={image.id}>
                                        <Image
                                            w="full"
                                            h="400px"
                                            bg="black"
                                            objectFit="contain"
                                            src={`/storage/${image.url}`}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <Image
                                    p={5}
                                    src="../nothing_image.png"
                                    alt="Green double couch with wooden legs"
                                />
                            )}
                        </Swiper>

                        {/* タイトル＆説明 */}
                        <Stack mt="6" pl={5} spacing="3">
                            <Heading size="lg">{post.title}</Heading>
                            <Text className="line-clamp-2">
                                {post.description}
                            </Text>
                        </Stack>

                        <Stack mt="5" mb="5" pl={5} spacing="3">
                            <Flex>
                                {/* 五段階評価 */}
                                <div>
                                    {Array(5)
                                        .fill("")
                                        .map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                w={6}
                                                h={6}
                                                color={
                                                    i < post.rating
                                                        ? "#ffc107"
                                                        : "#c4c4c4ff"
                                                }
                                            />
                                        ))}
                                </div>

                                {/* いいね機能 */}
                                {isLiked ? (
                                    <Flex ml={5}>
                                        <MdFavorite
                                            size={30}
                                            color="red"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                destroy(
                                                    route("post.unlike", post),
                                                    { method: "delete" }
                                                );
                                            }}
                                            cursor={"pointer"}
                                        />
                                        <span>{likes}</span>
                                    </Flex>
                                ) : (
                                    <Flex ml={5}>
                                        <MdFavoriteBorder
                                            size={30}
                                            color="red"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                submit(
                                                    route("post.like", post)
                                                );
                                            }}
                                            cursor={"pointer"}
                                        />
                                        <span>{likes}</span>
                                    </Flex>
                                )}
                            </Flex>

                            {/* コメント */}
                            <Box mb={5} mt={5}>
                                <form onSubmit={onSubmit}>
                                    <FormControl>
                                        <FormLabel htmlFor="restaurant_name">
                                            コメント
                                        </FormLabel>
                                        <Flex>
                                            <Input
                                                id="restaurant_name"
                                                size="md"
                                                htmlSize={50}
                                                width="auto"
                                                type="text"
                                                placeholder="コメントを入力"
                                                className="border px-2 py-1 mr-2 w-50%"
                                                onChange={(e) => {
                                                    setData(
                                                        "comment",
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                            <Button
                                                colorScheme="blue"
                                                type="submit"
                                                className="bg-gray-800 text-white px-3 py-1 rounded"
                                            >
                                                投稿
                                            </Button>
                                        </Flex>
                                    </FormControl>
                                </form>

                                {/* コメント一覧 */}
                                {arrayComments.map((comment) => (
                                    <Card
                                        key={comment.id}
                                        variant="elevated"
                                        my={3}
                                    >
                                        <CardBody>
                                            <Text>{comment.comment}</Text>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Box>
                        </Stack>

                        {/* 店名&住所 */}
                        <Text
                            textStyle="2xl"
                            fontWeight="medium"
                            letterSpacing="tight"
                            mt="2"
                        >
                            店名：{post.restaurant_name}
                        </Text>
                        <Text
                            textStyle="2xl"
                            fontWeight="medium"
                            letterSpacing="tight"
                        >
                            住所：{post.address}
                        </Text>

                        {/* マップ */}
                        <APIProvider apiKey={googleMapApiKey}>
                            <Box w="100%" h="400px">
                                <Map
                                    defaultZoom={13}
                                    defaultCenter={{
                                        lat: Number(post.latitude),
                                        lng: Number(post.longitude),
                                    }}
                                    mapId={mapId}
                                >
                                    <AdvancedMarker
                                        position={{
                                            lat: Number(post.latitude),
                                            lng: Number(post.longitude),
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
                    </CardBody>
                </Card>
            </Center>
        </Box>
    );
};

Show.layout = (page) => <MainLayout children={page} />;
export default Show;
