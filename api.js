import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL = "https://api.lens.dev";

export const client = new ApolloClient({
	uri: API_URL,
	cache: new InMemoryCache(),
});

export const challenge = gql`
	query Challenge($address: EthereumAddress!) {
		challenge(request: { address: $address }) {
			text
		}
	}
`;

export const authenticate = gql`
	mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
		authenticate(request: { address: $address, signature: $signature }) {
			accessToken
			refreshToken
		}
	}
`;

const GET_PUBLICATIONS_QUERY = `
query {
  explorePublications(request: {
    sortCriteria: TOP_COMMENTED,
    publicationTypes: [POST],
    limit: 20
  }) {
    items {
      __typename
      ... on Post {
        ...PostFields
      }
    }
  }
}

fragment ProfileFields on Profile {
  id
  name
  metadata
  handle
  picture {
    ... on NftImage {
      uri
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  stats {
    totalComments
    totalMirrors
    totalCollects
  }
}

fragment MediaFields on Media {
  url
}

fragment PublicationStatsFields on PublicationStats {
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}

fragment MetadataOutputFields on MetadataOutput {
    content
  media {
    original {
      ...MediaFields
    }
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
}
  `;

// publications = posts in Lens lingo
export const getPublications = async () => {
	const { data } = await client.query({
		query: gql(GET_PUBLICATIONS_QUERY),
	});
	return data.explorePublications.items;
};
