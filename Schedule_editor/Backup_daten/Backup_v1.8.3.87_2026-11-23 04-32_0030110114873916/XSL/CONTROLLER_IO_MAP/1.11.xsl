<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="/iomap/system/io[@module='JASPER']/firmware_version" />

  <xsl:template match="iomap/system/io[@module='JASPER']/*[last()]">
    <xsl:if test="name(.) != 'firmware_version'">
          <xsl:copy-of select="."/>
    </xsl:if>
    <control_board_firmware_version offset="51"/>
    <servo_board_firmware_version offset="98"/>
    <stepper_board_firmware_version offset="99"/>
  </xsl:template>

  <xsl:template match="iomap/power/io[@module='JASPER']/*[last()]">
      <xsl:copy-of select="."/>
      <dynamics_wetting_amps offset="108" mask="0x0001" digital_high="4095" digital_low="0"/>
      <dynamics_wetting_time offset="108" mask="0x0002" digital_high="4095" digital_low="0"/>
      <dynamics_wetting_ramp_rate offset="108" mask="0x3000" digital_high="4095" digital_low="0"/>
  </xsl:template>

  <xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="100" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="101" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="102" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="103" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="104" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="105" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="106" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/*[last()]">
    <xsl:copy-of select="."/>
    <current_telemetry offset="107" digital_high="4000" digital_low="0" />
  </xsl:template> 

  <!-- Do not change the template below -->
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template> 

</xsl:stylesheet>