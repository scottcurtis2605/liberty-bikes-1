package org.libertybikes.game.round.service;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.libertybikes.game.core.GameRound;

@Path("/")
@ApplicationScoped
public class GameRoundService {

    @Context
    UriInfo uri;

    Map<String, GameRound> allRounds = new HashMap<>();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<GameRound> listAllGames() {
        return allRounds.values();
    }

    @POST
    @Path("/create")
    public String createRound() {
        GameRound p = new GameRound();
        allRounds.put(p.id, p);
        System.out.println("Created round id=" + p.id);
        return p.id;
    }

    @GET
    @Path("/{roundId}")
    @Produces(MediaType.APPLICATION_JSON)
    public GameRound getRound(@PathParam("roundId") String roundId) {
        GameRound r = allRounds.get(roundId);
        if (r == null)
            return null;
        return r;
    }

//    @GET
//    @Path("/{roundId}/join")
//    @Produces(MediaType.APPLICATION_JSON)
//    public GameRound joinRound(@PathParam("roundId") String roundId, @QueryParam("playerId") String playerId) {
//        GameRound r = allRounds.get(roundId);
//        if (r == null)
//            return null;
//        r.players.add(playerId);
//        return r;
//    }
}
