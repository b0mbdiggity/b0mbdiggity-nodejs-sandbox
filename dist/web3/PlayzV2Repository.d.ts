import ConnectionManager from '../ConnectionManager';
import PlaydappERC721DTO from './PlaydappERC721DTO';
import { PlayzV2Metadata } from './PlayzV2Metadata';
declare class PlayzV2MSSQLRepository {
    private db;
    numberOfCharacterIndex: number;
    constructor(connectionManager: ConnectionManager);
    insertMetadata(erc721DTO: PlaydappERC721DTO): Promise<PlayzV2Metadata>;
}
export default PlayzV2MSSQLRepository;
