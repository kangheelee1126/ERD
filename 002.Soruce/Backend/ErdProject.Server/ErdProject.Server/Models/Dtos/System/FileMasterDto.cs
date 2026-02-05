using Newtonsoft.Json;

namespace ErdProject.Server.Models.Dtos.System
{
    public class FileMasterDto
    {
        [JsonProperty("fileNo")]
        public int FileNo { get; set; }

        [JsonProperty("refType")]
        public string RefType { get; set; } = string.Empty;

        [JsonProperty("refId")]
        public string RefId { get; set; } = string.Empty;

        [JsonProperty("fileSeq")]
        public int FileSeq { get; set; }

        [JsonProperty("fileId")]
        public string FileId { get; set; } = string.Empty;

        [JsonProperty("originNm")]
        public string OriginNm { get; set; } = string.Empty;

        [JsonProperty("fileSize")]
        public long FileSize { get; set; }

        [JsonProperty("fileExt")]
        public string FileExt { get; set; } = string.Empty;

        [JsonProperty("crtDt")]
        public string CrtDt { get; set; } = string.Empty;

        [JsonProperty("crtBy")]
        public string CrtBy { get; set; } = string.Empty;

        [JsonProperty("management")]
        public string Management { get; set; } = string.Empty;
    }
}