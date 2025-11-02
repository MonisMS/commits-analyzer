import { graphql } from "@octokit/graphql"

export const createGithubClient = (accessToken:string) =>{
    return graphql.defaults({
        headers:{authorization:`token ${accessToken}`}
    })

}

export type GithubClient = ReturnType<typeof createGithubClient>