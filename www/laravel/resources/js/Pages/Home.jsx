import { useEffect, useState } from "react";
import {
    Box,
    Image,
    Button,
    Text,
    Stack,
    HStack,
    Wrap,
    Center,
    WrapItem,
    Flex,
    Card,
    CardBody,
    CardFooter,
    Heading,
    Link,
    VStack,
} from "@chakra-ui/react";
import { usePage } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import { StarIcon } from "@chakra-ui/icons";
import Pagination from "@mui/material/Pagination";

const Home = ({ posts, images }) => {
    const [page, setPage] = useState(1);
    // const posts = usePage().props.posts;
    const maxCount = posts.length;
    const pageSize = 9;
    const maxPagination = Math.ceil(maxCount / pageSize); //ページネーション最大ページ数

    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const visibleItems = posts.slice(startRange, endRange); //1ページ内に表示するアイテムを算出

    return (
        <Box>
            <Center>
                <VStack>
                    <HStack w="85%">
                        <Wrap mt="10" spacing={12} justify="center">
                            {visibleItems.map((post) => (
                                <WrapItem key={post.id} w="360px">
                                    <Card
                                        key={post.id}
                                        overflow="hidden"
                                        height="580px"
                                        width="400px"
                                    >
                                        <CardBody gap="2">
                                            <Box mx="-6" mt="-6">
                                                {post.images.length > 0 ? (
                                                    <Image
                                                        w="full"
                                                        h="200px"
                                                        objectFit="cover"
                                                        src={`/storage/${post.images[0].url}`}
                                                        alt={post.title}
                                                    />
                                                ) : (
                                                    <Image
                                                        w="full"
                                                        h="200px"
                                                        src="../nothing_image.png"
                                                    />
                                                )}
                                            </Box>

                                            <Stack mt="6" spacing="3">
                                                <Heading size="lg">
                                                    {post.title}
                                                </Heading>
                                                <Text className="line-clamp-2">
                                                    {post.description}
                                                </Text>
                                                <Text
                                                    textStyle="2xl"
                                                    fontWeight="medium"
                                                    letterSpacing="tight"
                                                    mt="2"
                                                >
                                                    {post.restaurant_name}
                                                </Text>
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
                                                                    i <
                                                                    post.rating
                                                                        ? "#ffc107"
                                                                        : "#c4c4c4ff"
                                                                }
                                                            />
                                                        ))}
                                                </div>
                                            </Stack>
                                        </CardBody>
                                        <CardFooter gap="2">
                                            <Link
                                                href={route(
                                                    "post.show",
                                                    post.id
                                                )}
                                                width="full"
                                            >
                                                <Button
                                                    variant="solid"
                                                    width="full"
                                                >
                                                    投稿を見る
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </WrapItem>
                            ))}
                        </Wrap>
                    </HStack>
                    <Card p={3} mt={10} variant="filled" borderRadius="3xl">
                        <Pagination
                            count={maxPagination}
                            variant="outlined"
                            color="primary"
                            onChange={(e, page) => setPage(page)}
                            page={page}
                        />
                    </Card>
                </VStack>
            </Center>
        </Box>
    );
};

Home.layout = (page) => <MainLayout children={page} />;
export default Home;
