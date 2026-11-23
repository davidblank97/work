<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="/peripheral/ports/comport/port" >
    <xsl:choose>
      <!--NOTE: Using ethernetName to determine if the system is a GTVII or LSC-->
      <xsl:when test="/peripheral/ports/ethernet/name = 'Powerwave'">
        <xsl:copy-of select="."/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:choose>
          <xsl:when test="./parent::*/name ='PENDANT'">
            <port>3</port>
          </xsl:when>
          <xsl:when test="./parent::*/name ='SMART TRAK MFC'">
            <port>2</port>
          </xsl:when>
          <xsl:otherwise>
            <xsl:copy-of select="."/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="peripheral/devices/camera_light" >
    <camera light_enable="false">
      <sync_trigger mode="disable" pulse_width="50" frequency="100" transition_delay_us="0"/>
    </camera>
  </xsl:template>

  <!-- Do not change the template below-->
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
