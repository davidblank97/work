<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="iomap/firmware_version/control_board">
    <xsl:copy>
      <xsl:value-of select="'2.27.3'"/>
    </xsl:copy>
  </xsl:template> 

  <xsl:template match="iomap/system/io[@module='JASPER']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <camera_sync_trigger_mode offset="109" mask="0x0000" digital_high="4095" digital_low="0"/>
      <camera_sync_trigger_on_time offset="109" mask="0x2000" digital_high="4095" digital_low="0"/>
      <camera_sync_trigger_period offset="109" mask="0x3000" digital_high="4095" digital_low="0"/>
      <camera_sync_trigger_transition_delay offset="109" mask="0x4000" digital_high="4095" digital_low="0"/>
      <camera_sync_trigger_multiplier offset="109" mask="0x5000" digital_high="4095" digital_low="0"/>
    </xsl:copy>
  </xsl:template> 

  <xsl:template match="iomap/power/io[@module='JASPER']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <software_arc_pulse_state offset="97" bit="0"/>
    </xsl:copy>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>