<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

  <xsl:template match="iomap/spares/io[@module='JASPER']/spare_digital_input_0">
    <spare_digital_input_0 offset="40" bit="0" mask="1"/>
  </xsl:template> 

  <xsl:template match="iomap/power/io[@module='JASPER']">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
      <mig_dip_blast_ramp_rate offset="108" mask="0xE000" digital_high="4095" digital_low="0"/>
      <mig_dip_burnback_ramp_rate offset="108" mask="0xF000" digital_high="4095" digital_low="0"/>
      <mig_dip_detect_clear_short_current offset="118" mask="0x0000" digital_high="4095" digital_low="0"/>
      <mig_dip_start_ramp_to_clear_short_current offset="118" mask="0x1000" digital_high="4095" digital_low="0"/>
    </xsl:copy>
  </xsl:template> 

  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>