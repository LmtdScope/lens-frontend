import { getPublications } from "../api";

import { useState, useEffect } from "react";
import { VStack, HStack, Avatar, Text } from "@chakra-ui/react";

const Timeline = () => {
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		getPublications().then(setPosts);
	}, []);
	return (
		<VStack
			spacing={4}
			marginY="10">
			{posts
				.filter((post) => post.__typename === "Post") // we
				.map((post) => {
					// console.log(post);
					let url = post?.profile?.picture?.original?.url;
					let slice = url?.slice(url.lastIndexOf("/"), url?.length);
					let renderURL = `https://ipfs.io/ipfs/${slice}`;
					return (
						<VStack
							key={post.id}
							borderWidth="0.7px"
							paddingX="4"
							paddingY="2"
							rounded="md"
							width="full"
							alignItems="left"
							// as="a"
							// href={`https://lenster.xyz/posts/${post.id}`}
							// target="_blank"
							transition="all 0.2s"
							_hover={{
								shadow: "md",
							}}>
							<HStack>
								<Avatar src={renderURL} />
								<Text
									fontWeight="bold"
									justifyContent="left">
									{post.profile?.handle || post.profile?.id}
								</Text>
							</HStack>
							<Text>{post.metadata?.content}</Text>
							<HStack textColor="gray.400">
								<Text>
									{post.stats?.totalAmountOfComments}{" "}
									comments,
								</Text>
								<Text>
									{post.stats?.totalAmountOfMirrors} mirrors,
								</Text>
								<Text>
									{post.stats?.totalAmountOfCollects} collects
								</Text>
							</HStack>
						</VStack>
					);
				})}
		</VStack>
	);
};

export default Timeline;
