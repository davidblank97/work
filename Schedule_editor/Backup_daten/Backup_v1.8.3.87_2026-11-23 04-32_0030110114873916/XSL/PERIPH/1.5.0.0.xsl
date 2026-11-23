<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="peripheral" >
    <xsl:choose>
      <xsl:when test="/peripheral/ports/ethernet/name = 'Powerwave'">
        <peripheral name="LSC">
          <xsl:apply-templates select="@*|node()"/>
        </peripheral>
      </xsl:when>
      <xsl:when test="/peripheral/devices/gas_controller/shield[@type ='SST']">
        <peripheral name="GTVII MFC">
          <xsl:apply-templates select="@*|node()"/>
        </peripheral>
      </xsl:when>
      <xsl:when test="/peripheral/devices/gas_controller/trail[@type ='SST']">
        <peripheral name="GTVII MFC">
          <xsl:apply-templates select="@*|node()"/>
        </peripheral>
      </xsl:when>
      <xsl:when test="/peripheral/devices/gas_controller/plasma[@type ='SST']">
        <peripheral name="GTVII MFC">
          <xsl:apply-templates select="@*|node()"/>
        </peripheral>
      </xsl:when>
      <xsl:otherwise>
        <peripheral name="GTVII">
          <xsl:apply-templates select="@*|node()"/>
        </peripheral>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="/peripheral/devices">
    <xsl:copy-of select="."/>
    <services>
      <ota enable="true">
        <host_name>10.5.5.2</host_name>
        <port>21</port>
        <username>softdev</username>
        <password>GoldTrak6</password>
        <remote_update_directory>//Upgrades</remote_update_directory>
        <remote_backup_directory>//Backups</remote_backup_directory>
      </ota>
      <mqtt enable="true"/>
      <whiteking_api enable="true">
        <channel>6</channel>
      </whiteking_api>
      <modbus enable="true">
        <channel>
          <xsl:value-of select="/peripheral/network/channel"/>
        </channel>
      </modbus>
    </services>
  </xsl:template>
  <xsl:template match="/peripheral/ports/*[last()]">
    <xsl:copy-of select="."/>
    <pipe channel='6'>
      <name>wkAPI</name>
    </pipe>
  </xsl:template>
  <xsl:template match="/peripheral/services/modbus/@enable">
    <xsl:attribute name="enable">
      <xsl:value-of select="/peripheral/network/@enable"/>
    </xsl:attribute>
  </xsl:template>
  <xsl:template match="/peripheral/network"/>

  <!-- Do not change the template below-->
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>