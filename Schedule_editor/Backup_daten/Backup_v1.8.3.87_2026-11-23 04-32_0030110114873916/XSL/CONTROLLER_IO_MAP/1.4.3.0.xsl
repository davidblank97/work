<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/power/io[@module='JASPER']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<mig_dip_pre_detachment_ramp_rate offset="118" mask="0x2000" digital_high="4095" digital_low="0"/>
			<mig_dip_energy_setpoint offset="119" digital_high="65535" digital_low="0" />
			<mig_dip_energy_telemetry offset="119" digital_high="65535" digital_low="0" />
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>